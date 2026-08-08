import { Restaurant } from '../models/v2/restaurant.js'
import { MenuItem } from '../models/v2/menuItem.js'
import { Offer } from '../models/v2/offer.js'

/**
 * Shared restaurant querying so home, listing and search behave identically.
 */

/**
 * Active restaurant-scoped offers, keyed by restaurant id.
 * One query, used to decorate cards with an `offerLabel`.
 */
export const getRestaurantOfferMap = async (restaurantIds = null) => {
    const filter = {
        isActive: true,
        scope: 'restaurant',
        $or: [{ validTo: null }, { validTo: { $gt: new Date() } }],
    }
    if (restaurantIds) filter.restaurant = { $in: restaurantIds }

    const offers = await Offer.find(filter).lean()
    const map = new Map()
    for (const offer of offers) {
        const key = offer.restaurant?.toString()
        if (!key) continue
        if (!map.has(key)) map.set(key, [])
        map.get(key).push(offer)
    }
    return map
}

const SORTS = {
    relevance: { popularityScore: -1, 'rating.average': -1 },
    popular: { popularityScore: -1 },
    rating: { 'rating.average': -1, 'rating.count': -1 },
    deliveryTime: { deliveryTimeMinutes: 1 },
    priceLow: { priceForTwo: 1 },
    priceHigh: { priceForTwo: -1 },
}

/**
 * Turns validated query params into a Mongo filter.
 * Filters compose with AND — a consumer expects "veg AND rated 4+" to narrow.
 */
export const buildRestaurantFilter = async (params) => {
    const filter = { isActive: true }

    if (params.cuisine?.length) filter.cuisines = { $in: params.cuisine }
    if (params.veg) filter.isVegOnly = true
    if (params.rating) filter['rating.average'] = { $gte: params.rating }
    if (params.maxDeliveryTime) filter.deliveryTimeMinutes = { $lte: params.maxDeliveryTime }
    if (params.maxPrice) filter.priceForTwo = { $lte: params.maxPrice }
    if (params.freeDelivery) {
        filter.$or = [{ deliveryFee: 0 }, { freeDeliveryAbove: { $ne: null } }]
    }

    // Restaurants that currently carry an offer.
    if (params.offers) {
        const offerMap = await getRestaurantOfferMap()
        filter._id = { $in: [...offerMap.keys()].map((id) => id) }
    }

    // Text search folded into the same filter so search and browse share one path.
    if (params.q) {
        const rx = new RegExp(escapeRegex(params.q), 'i')
        const matchingItems = await MenuItem.find({ name: rx, isAvailable: true })
            .distinct('restaurant')

        const or = [{ name: rx }, { cuisines: rx }, { area: rx }]
        if (matchingItems.length) or.push({ _id: { $in: matchingItems } })

        // Combine with any pre-existing $or (freeDelivery) via $and.
        if (filter.$or) {
            filter.$and = [{ $or: filter.$or }, { $or: or }]
            delete filter.$or
        } else {
            filter.$or = or
        }
    }

    return filter
}

export const escapeRegex = (text) => String(text).replace(/[.*+?^${}()|[\]\\]/g, '\\$&')

export const getSort = (sort) => SORTS[sort] || SORTS.relevance

export const findRestaurants = async (params) => {
    const filter = await buildRestaurantFilter(params)
    const { page, limit } = params

    const [docs, total] = await Promise.all([
        Restaurant.find(filter).sort(getSort(params.sort)).skip((page - 1) * limit).limit(limit).lean(),
        Restaurant.countDocuments(filter),
    ])

    return { docs, total }
}
