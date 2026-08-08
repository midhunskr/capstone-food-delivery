import { Restaurant } from '../models/v2/restaurant.js'
import { MenuItem } from '../models/v2/menuItem.js'
import { Offer } from '../models/v2/offer.js'
import { ApiError } from '../utils/apiError.js'
import { env } from '../config/env.js'

/**
 * The one place a payable amount is produced.
 *
 * Everything the client sends is treated as a request, not a fact: prices,
 * availability, delivery fee, discount and tax are all recomputed from the
 * database. The client's totals are never read.
 *
 * Money is whole rupees (integers) throughout, matching the seed data. A single
 * Math.round at the tax step keeps the bill lines summing exactly to the total.
 */

const MAX_QUANTITY_PER_ITEM = 20
const MAX_DISTINCT_ITEMS = 30

/** Human reason why an offer doesn't apply, or null when it does. */
const offerIneligibility = (offer, { subtotal, restaurantId }) => {
    const now = new Date()

    if (!offer.isActive) return "That offer isn't running right now."
    if (offer.validFrom && offer.validFrom > now) return "That offer hasn't started yet."
    if (offer.validTo && offer.validTo < now) return "That code has expired."

    if (offer.scope === 'restaurant') {
        const target = offer.restaurant?._id ?? offer.restaurant
        if (!target || String(target) !== String(restaurantId)) {
            return "That code isn't available for this restaurant."
        }
    }

    if (offer.minimumOrder > 0 && subtotal < offer.minimumOrder) {
        const short = offer.minimumOrder - subtotal
        return `This offer needs a minimum order of ₹${offer.minimumOrder} — you're ₹${short} away.`
    }

    return null
}

const discountFor = (offer, { subtotal, deliveryFee }) => {
    if (offer.type === 'percentage') {
        const raw = Math.round((subtotal * offer.value) / 100)
        return { discount: offer.maxDiscount ? Math.min(raw, offer.maxDiscount) : raw, freeDelivery: false }
    }
    if (offer.type === 'flat') {
        return { discount: Math.min(offer.value, subtotal), freeDelivery: false }
    }
    if (offer.type === 'free_delivery') {
        return { discount: 0, freeDelivery: deliveryFee > 0 }
    }
    return { discount: 0, freeDelivery: false }
}

export const offerSummary = (offer, savings = null) => ({
    id: offer._id.toString(),
    code: offer.code ?? null,
    title: offer.title,
    description: offer.description ?? null,
    type: offer.type,
    minimumOrder: offer.minimumOrder ?? 0,
    ...(savings === null ? {} : { savings }),
})

/**
 * Builds an authoritative quote.
 *
 * @param {object} input
 * @param {string} input.restaurantId
 * @param {Array<{menuItemId: string, quantity: number}>} input.items
 * @param {string} [input.offerCode]
 * @returns {Promise<object>} quote
 */
export const buildQuote = async ({ restaurantId, items, offerCode }) => {
    if (!Array.isArray(items) || items.length === 0) {
        throw ApiError.badRequest('CART_EMPTY', 'Your cart is empty.')
    }
    if (items.length > MAX_DISTINCT_ITEMS) {
        throw ApiError.badRequest('CART_TOO_LARGE', "That's more items than we can take in one order.")
    }

    const restaurant = await Restaurant.findById(restaurantId).lean().catch(() => null)
    if (!restaurant || !restaurant.isActive) {
        throw ApiError.notFound('RESTAURANT_UNAVAILABLE', "That restaurant isn't available right now.")
    }

    const ids = items.map((i) => i.menuItemId)
    const menuItems = await MenuItem.find({ _id: { $in: ids }, restaurant: restaurant._id }).lean()
    const byId = new Map(menuItems.map((m) => [m._id.toString(), m]))

    const lines = []
    const warnings = []
    let subtotal = 0

    for (const requested of items) {
        const menuItem = byId.get(String(requested.menuItemId))

        // An id we don't recognise for this restaurant is dropped, not priced.
        // This also rejects a cart that mixes restaurants.
        if (!menuItem) {
            warnings.push({ code: 'ITEM_NOT_FOUND', menuItemId: String(requested.menuItemId),
                message: "One item is no longer on the menu. We've removed it." })
            continue
        }

        if (!menuItem.isAvailable) {
            warnings.push({ code: 'ITEM_UNAVAILABLE', menuItemId: menuItem._id.toString(),
                message: `${menuItem.name} just sold out. We've taken it out of your cart.` })
            continue
        }

        const quantity = Math.floor(Number(requested.quantity))
        if (!Number.isFinite(quantity) || quantity < 1) {
            throw ApiError.badRequest('QUANTITY_INVALID', 'Check the quantities in your cart.')
        }
        if (quantity > MAX_QUANTITY_PER_ITEM) {
            throw ApiError.badRequest('QUANTITY_TOO_HIGH',
                `You can order up to ${MAX_QUANTITY_PER_ITEM} of one item.`)
        }

        const lineTotal = menuItem.price * quantity
        subtotal += lineTotal

        lines.push({
            menuItemId: menuItem._id.toString(),
            name: menuItem.name,
            image: menuItem.image ?? null,
            isVeg: !!menuItem.isVeg,
            unitPrice: menuItem.price,
            quantity,
            lineTotal,
        })
    }

    if (lines.length === 0) {
        throw ApiError.badRequest('CART_UNAVAILABLE',
            "Nothing in your cart is available right now.")
    }

    // Delivery fee: the restaurant's own free-delivery threshold applies before
    // any offer is considered.
    const meetsThreshold = restaurant.freeDeliveryAbove !== null
        && restaurant.freeDeliveryAbove !== undefined
        && subtotal >= restaurant.freeDeliveryAbove
    let deliveryFee = meetsThreshold ? 0 : (restaurant.deliveryFee ?? 0)

    let discount = 0
    let appliedOffer = null
    let offerError = null

    if (offerCode) {
        const offer = await Offer.findOne({ code: String(offerCode).trim().toUpperCase() })
        if (!offer) {
            offerError = "We don't recognise that code."
        } else {
            const reason = offerIneligibility(offer, { subtotal, restaurantId: restaurant._id })
            if (reason) {
                offerError = reason
            } else {
                const result = discountFor(offer, { subtotal, deliveryFee })
                discount = result.discount
                const deliverySaving = result.freeDelivery ? deliveryFee : 0
                if (result.freeDelivery) deliveryFee = 0
                appliedOffer = offerSummary(offer, discount + deliverySaving)
            }
        }
    }

    // Tax applies to the discounted item total, not to fees.
    const taxable = Math.max(0, subtotal - discount)
    const tax = Math.round((taxable * env.taxPercent) / 100)
    const total = Math.max(0, taxable + deliveryFee + tax)

    return {
        restaurant: {
            id: restaurant._id.toString(),
            name: restaurant.name,
            slug: restaurant.slug,
            image: restaurant.image ?? null,
            area: restaurant.area,
            deliveryTimeMinutes: restaurant.deliveryTimeMinutes,
        },
        items: lines,
        pricing: {
            subtotal,
            discount,
            deliveryFee,
            tax,
            taxPercent: env.taxPercent,
            total,
        },
        appliedOffer,
        offerError,
        warnings,
    }
}

/**
 * Offers worth showing for this restaurant and cart, each labelled with whether
 * it currently applies and what it would save.
 */
export const availableOffersFor = async ({ restaurantId, subtotal }) => {
    const now = new Date()

    const offers = await Offer.find({
        isActive: true,
        $or: [
            { scope: 'global' },
            { scope: 'restaurant', restaurant: restaurantId },
        ],
        $and: [{ $or: [{ validTo: null }, { validTo: { $gt: now } }] }],
    }).lean()

    return offers.map((offer) => {
        const reason = offerIneligibility(offer, { subtotal, restaurantId })
        const { discount } = reason ? { discount: 0 } : discountFor(offer, { subtotal, deliveryFee: 0 })
        return {
            ...offerSummary(offer),
            eligible: !reason,
            reason,
            savings: reason ? 0 : discount,
        }
    })
}
