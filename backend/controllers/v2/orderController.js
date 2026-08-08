import { Order } from '../../models/v2/order.js'
import { MenuItem } from '../../models/v2/menuItem.js'
import { Restaurant } from '../../models/v2/restaurant.js'
import { asyncHandler } from '../../utils/asyncHandler.js'
import { sendSuccess, buildMeta } from '../../utils/apiResponse.js'
import { ApiError } from '../../utils/apiError.js'
import { orderCard, orderDetail } from '../../utils/dto.js'
import { advanceOrder, advanceOrders } from '../../services/orderStatus.js'

const ACTIVE = ['confirmed', 'preparing', 'on_the_way']

/**
 * GET /api/v2/orders
 *
 * The caller's own orders, newest first. Unpaid orders are hidden — an abandoned
 * payment is not something anyone wants to see in their history.
 */
export const listOrders = asyncHandler(async (req, res) => {
    const { page, limit } = req.query
    const filter = {
        user: req.user.id,
        status: { $nin: ['pending_payment', 'payment_failed'] },
    }

    const [orders, total] = await Promise.all([
        Order.find(filter).sort({ createdAt: -1 }).skip((page - 1) * limit).limit(limit),
        Order.countDocuments(filter),
    ])

    // Bring each one up to the status it has earned before rendering.
    await advanceOrders(orders)

    const cards = orders.map(orderCard)

    return sendSuccess(res, {
        active: cards.filter((o) => ACTIVE.includes(o.status)),
        past: cards.filter((o) => !ACTIVE.includes(o.status)),
    }, { meta: buildMeta({ page, limit, total }) })
})

/**
 * GET /api/v2/orders/:orderNumber
 *
 * Someone else's order number returns exactly the same 404 as one that doesn't
 * exist — guessing must not reveal that an order is real.
 */
export const getOrder = asyncHandler(async (req, res) => {
    const order = await Order.findOne({ orderNumber: req.params.orderNumber.toUpperCase() })

    if (!order || String(order.user) !== String(req.user.id)) {
        throw ApiError.notFound('ORDER_NOT_FOUND', "We couldn't find that order.")
    }

    await advanceOrder(order)
    return sendSuccess(res, orderDetail(order))
})

/**
 * POST /api/v2/orders/:orderNumber/reorder
 *
 * Returns a cart payload rather than mutating anything: the client owns the
 * cart, and it may need to run the existing "start a new cart?" confirmation
 * first. Unavailable items are reported, never silently substituted.
 */
export const reorder = asyncHandler(async (req, res) => {
    const order = await Order.findOne({ orderNumber: req.params.orderNumber.toUpperCase() }).lean()

    if (!order || String(order.user) !== String(req.user.id)) {
        throw ApiError.notFound('ORDER_NOT_FOUND', "We couldn't find that order.")
    }

    const restaurant = await Restaurant.findById(order.restaurant.id).lean()
    if (!restaurant || !restaurant.isActive) {
        throw ApiError.badRequest('RESTAURANT_UNAVAILABLE',
            `${order.restaurant.name} isn't taking orders right now.`)
    }

    const menuItems = await MenuItem.find({
        _id: { $in: order.items.map((i) => i.menuItemId) },
        restaurant: restaurant._id,
    }).lean()
    const byId = new Map(menuItems.map((m) => [m._id.toString(), m]))

    const available = []
    const unavailable = []

    for (const item of order.items) {
        const current = byId.get(item.menuItemId.toString())
        if (!current || !current.isAvailable) {
            unavailable.push(item.name)
            continue
        }
        available.push({
            menuItemId: current._id.toString(),
            name: current.name,
            // Current price, not what it cost last time.
            price: current.price,
            image: current.image ?? null,
            isVeg: !!current.isVeg,
            quantity: item.quantity,
        })
    }

    if (available.length === 0) {
        throw ApiError.badRequest('REORDER_UNAVAILABLE',
            `Nothing from that order is available right now.`)
    }

    return sendSuccess(res, {
        restaurantId: restaurant._id.toString(),
        restaurantSlug: restaurant.slug,
        restaurantName: restaurant.name,
        items: available,
        unavailable,
    })
})
