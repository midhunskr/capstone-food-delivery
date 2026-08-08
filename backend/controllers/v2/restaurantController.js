import { Restaurant } from '../../models/v2/restaurant.js'
import { MenuItem } from '../../models/v2/menuItem.js'
import { Offer } from '../../models/v2/offer.js'
import { asyncHandler } from '../../utils/asyncHandler.js'
import { sendSuccess, buildMeta } from '../../utils/apiResponse.js'
import { ApiError } from '../../utils/apiError.js'
import { restaurantCard, restaurantDetail, menuItemCard } from '../../utils/dto.js'
import { findRestaurants, getRestaurantOfferMap, escapeRegex } from '../../services/restaurantQuery.js'

/**
 * GET /api/v2/restaurants
 */
export const listRestaurants = asyncHandler(async (req, res) => {
    const params = req.query
    const { docs, total } = await findRestaurants(params)

    const offerMap = await getRestaurantOfferMap(docs.map((d) => d._id))
    const data = docs.map((r) => restaurantCard(r, { offer: offerMap.get(r._id.toString())?.[0] ?? null }))

    return sendSuccess(res, data, {
        meta: buildMeta({ page: params.page, limit: params.limit, total }),
    })
})

/**
 * GET /api/v2/restaurants/:slug
 * Menu deliberately lives on its own endpoint — the header renders without it.
 */
export const getRestaurantBySlug = asyncHandler(async (req, res) => {
    const restaurant = await Restaurant.findOne({ slug: req.params.slug, isActive: true }).lean()

    if (!restaurant) {
        throw ApiError.notFound('RESTAURANT_NOT_FOUND', "We couldn't find that restaurant.")
    }

    const offers = await Offer.find({
        isActive: true,
        $or: [
            { scope: 'restaurant', restaurant: restaurant._id },
            { scope: 'global' },
        ],
        $and: [{ $or: [{ validTo: null }, { validTo: { $gt: new Date() } }] }],
    }).lean()

    const itemCount = await MenuItem.countDocuments({ restaurant: restaurant._id, isAvailable: true })

    return sendSuccess(res, {
        ...restaurantDetail(restaurant, { offers }),
        menuItemCount: itemCount,
    })
})

/**
 * GET /api/v2/restaurants/:slug/menu
 *
 * Returns the menu already grouped into categories, plus a flat category list
 * for section tabs. The frontend should never have to rebuild groupings itself.
 */
export const getRestaurantMenu = asyncHandler(async (req, res) => {
    const restaurant = await Restaurant.findOne({ slug: req.params.slug, isActive: true })
        .select('_id name slug area deliveryTimeMinutes rating isVegOnly').lean()

    if (!restaurant) {
        throw ApiError.notFound('RESTAURANT_NOT_FOUND', "We couldn't find that restaurant.")
    }

    const filter = { restaurant: restaurant._id }
    if (req.query.veg) filter.isVeg = true
    if (req.query.category) filter.category = req.query.category
    if (req.query.q) {
        const rx = new RegExp(escapeRegex(req.query.q), 'i')
        filter.$or = [{ name: rx }, { description: rx }]
    }

    const items = await MenuItem.find(filter)
        .sort({ categoryOrder: 1, isBestseller: -1, isPopular: -1, name: 1 }).lean()

    // Group in insertion order so section order stays stable across requests.
    const sections = []
    const index = new Map()
    for (const item of items) {
        if (!index.has(item.category)) {
            index.set(item.category, { category: item.category, items: [] })
            sections.push(index.get(item.category))
        }
        index.get(item.category).items.push(menuItemCard(item))
    }

    return sendSuccess(res, {
        restaurant: {
            id: restaurant._id.toString(),
            name: restaurant.name,
            slug: restaurant.slug,
            area: restaurant.area,
            isVegOnly: !!restaurant.isVegOnly,
        },
        categories: sections.map((s) => ({ name: s.category, count: s.items.length })),
        sections,
        totalItems: items.length,
    })
})
