import { Restaurant } from '../../models/v2/restaurant.js'
import { MenuItem } from '../../models/v2/menuItem.js'
import { Cuisine } from '../../models/v2/cuisine.js'
import { Offer } from '../../models/v2/offer.js'
import { asyncHandler } from '../../utils/asyncHandler.js'
import { sendSuccess } from '../../utils/apiResponse.js'
import { restaurantCard, menuItemCard, offerCard, cuisineCard } from '../../utils/dto.js'
import { getRestaurantOfferMap, escapeRegex } from '../../services/restaurantQuery.js'
import { homePicks } from '../../seed/data/homePicks.js'

/**
 * The home rail is curated (see seed/data/homePicks.js) rather than derived
 * purely from popularity flags, which produced a scattershot list. Anything
 * that doesn't resolve is skipped; if nothing resolves we fall back to the
 * flags so the rail is never empty.
 */
const findPopularDishes = async () => {
    const slugs = [...new Set(homePicks.map((p) => p.restaurant))]
    const restaurants = await Restaurant.find({ slug: { $in: slugs }, isActive: true })
        .select('slug').lean()
    const idBySlug = new Map(restaurants.map((r) => [r.slug, r._id]))

    const conditions = homePicks
        .map((pick) => {
            const restaurant = idBySlug.get(pick.restaurant)
            return restaurant ? { restaurant, name: pick.dish } : null
        })
        .filter(Boolean)

    if (conditions.length > 0) {
        const found = await MenuItem.find({ $or: conditions, isAvailable: true }).lean()

        // Return them in the curated order, not Mongo's.
        const order = new Map(homePicks.map((p, i) => [`${p.restaurant}:${p.dish}`, i]))
        const slugById = new Map(restaurants.map((r) => [r._id.toString(), r.slug]))
        const ordered = found
            .map((item) => ({
                item,
                rank: order.get(`${slugById.get(item.restaurant.toString())}:${item.name}`) ?? 999,
            }))
            .sort((a, b) => a.rank - b.rank)
            .map((x) => x.item)

        if (ordered.length > 0) return ordered
    }

    return MenuItem.find({ isAvailable: true, $or: [{ isPopular: true }, { isBestseller: true }] })
        .sort({ 'rating.average': -1, orderCount: -1 }).limit(12).lean()
}

const activeOfferFilter = () => ({
    isActive: true,
    $or: [{ validTo: null }, { validTo: { $gt: new Date() } }],
})

const decorate = (docs, offerMap) =>
    docs.map((r) => restaurantCard(r, { offer: offerMap.get(r._id.toString())?.[0] ?? null }))

/**
 * GET /api/v2/home
 *
 * One request for the whole discovery page. Sections are capped — home is a
 * shortlist, not a dump of the catalogue. Browsing the full set is what
 * /restaurants is for.
 */
export const getHome = asyncHandler(async (req, res) => {
    const base = { isActive: true }

    const [popular, topRated, nearby, featured, dishes, cuisineDocs, offers, offerMap] = await Promise.all([
        Restaurant.find({ ...base, isPopular: true }).sort({ popularityScore: -1 }).limit(10).lean(),
        Restaurant.find({ ...base, 'rating.count': { $gte: 50 } }).sort({ 'rating.average': -1 }).limit(10).lean(),
        // "Nearby" is a fast-delivery proxy until addresses and coordinates land
        // in a later block. Contract stays the same when real distance arrives.
        Restaurant.find(base).sort({ deliveryTimeMinutes: 1 }).limit(10).lean(),
        Restaurant.find({ ...base, isFeatured: true }).sort({ popularityScore: -1 }).limit(8).lean(),
        findPopularDishes(),
        Cuisine.find({ isActive: true }).sort({ displayOrder: 1 }).lean(),
        Offer.find(activeOfferFilter()).populate('restaurant', 'name slug').sort({ scope: 1 }).limit(8).lean(),
        getRestaurantOfferMap(),
    ])

    // Attach each popular dish's restaurant so the card can link somewhere.
    const dishRestaurantIds = [...new Set(dishes.map((d) => d.restaurant.toString()))]
    const dishRestaurants = await Restaurant.find({ _id: { $in: dishRestaurantIds } })
        .select('name slug area deliveryTimeMinutes rating').lean()
    const restaurantById = new Map(dishRestaurants.map((r) => [r._id.toString(), r]))

    const cuisineCounts = await Restaurant.aggregate([
        { $match: base },
        { $unwind: '$cuisines' },
        { $group: { _id: '$cuisines', count: { $sum: 1 } } },
    ])
    const countBySlug = new Map(cuisineCounts.map((c) => [c._id, c.count]))

    return sendSuccess(res, {
        cuisines: cuisineDocs.map((c) => cuisineCard(c, { restaurantCount: countBySlug.get(c.slug) ?? 0 })),
        offers: offers.map(offerCard),
        featuredRestaurants: decorate(featured, offerMap),
        popularRestaurants: decorate(popular, offerMap),
        topRatedRestaurants: decorate(topRated, offerMap),
        nearbyRestaurants: decorate(nearby, offerMap),
        popularDishes: dishes.map((d) =>
            menuItemCard(d, { restaurant: restaurantById.get(d.restaurant.toString()) ?? null })),
    })
})

/**
 * GET /api/v2/cuisines
 */
export const listCuisines = asyncHandler(async (req, res) => {
    const [docs, counts] = await Promise.all([
        Cuisine.find({ isActive: true }).sort({ displayOrder: 1 }).lean(),
        Restaurant.aggregate([
            { $match: { isActive: true } },
            { $unwind: '$cuisines' },
            { $group: { _id: '$cuisines', count: { $sum: 1 } } },
        ]),
    ])

    const countBySlug = new Map(counts.map((c) => [c._id, c.count]))
    return sendSuccess(res, docs.map((c) => cuisineCard(c, { restaurantCount: countBySlug.get(c.slug) ?? 0 })))
})

/**
 * GET /api/v2/offers
 */
export const listOffers = asyncHandler(async (req, res) => {
    const filter = activeOfferFilter()

    if (req.query.restaurantSlug) {
        const restaurant = await Restaurant.findOne({ slug: req.query.restaurantSlug }).select('_id').lean()
        // Restaurant-specific view still includes global offers — they apply there too.
        filter.$and = [{
            $or: [
                { scope: 'global' },
                { scope: 'restaurant', restaurant: restaurant?._id ?? null },
            ],
        }]
    }

    const offers = await Offer.find(filter).populate('restaurant', 'name slug').sort({ scope: 1, createdAt: 1 }).lean()
    return sendSuccess(res, offers.map(offerCard))
})

/**
 * GET /api/v2/search
 *
 * Small dataset, so anchored regex plus simple ranking beats a text index here:
 * it matches partial words ("biry" → Biryani), which $text cannot do.
 */
export const search = asyncHandler(async (req, res) => {
    const { q, limit } = req.query

    if (!q || q.length < 2) {
        return sendSuccess(res, { query: q ?? '', restaurants: [], dishes: [], cuisines: [] })
    }

    const rx = new RegExp(escapeRegex(q), 'i')
    const startsWith = new RegExp(`^${escapeRegex(q)}`, 'i')

    const [restaurants, dishes, cuisines] = await Promise.all([
        Restaurant.find({ isActive: true, $or: [{ name: rx }, { cuisines: rx }, { area: rx }] })
            .limit(limit * 2).lean(),
        MenuItem.find({ isAvailable: true, $or: [{ name: rx }, { description: rx }] })
            .limit(limit * 3).lean(),
        Cuisine.find({ isActive: true, name: rx }).limit(limit).lean(),
    ])

    // Rank: name-prefix match first, then rating. Cheap and predictable.
    const rank = (list, nameOf, ratingOf) => list.sort((a, b) => {
        const aStarts = startsWith.test(nameOf(a)) ? 0 : 1
        const bStarts = startsWith.test(nameOf(b)) ? 0 : 1
        if (aStarts !== bStarts) return aStarts - bStarts
        return (ratingOf(b) ?? 0) - (ratingOf(a) ?? 0)
    })

    rank(restaurants, (r) => r.name, (r) => r.rating?.average)
    rank(dishes, (d) => d.name, (d) => d.rating?.average)

    const topRestaurants = restaurants.slice(0, limit)
    const topDishes = dishes.slice(0, limit)

    const offerMap = await getRestaurantOfferMap(topRestaurants.map((r) => r._id))
    const dishRestaurants = await Restaurant.find({ _id: { $in: topDishes.map((d) => d.restaurant) } })
        .select('name slug area deliveryTimeMinutes rating').lean()
    const restaurantById = new Map(dishRestaurants.map((r) => [r._id.toString(), r]))

    return sendSuccess(res, {
        query: q,
        restaurants: decorate(topRestaurants, offerMap),
        dishes: topDishes.map((d) =>
            menuItemCard(d, { restaurant: restaurantById.get(d.restaurant.toString()) ?? null })),
        cuisines: cuisines.map((c) => cuisineCard(c)),
    })
})

/**
 * GET /api/v2/search/suggest
 * Typeahead only: labels and where to go, nothing heavy.
 */
export const suggest = asyncHandler(async (req, res) => {
    const { q } = req.query

    if (!q || q.length < 2) return sendSuccess(res, { query: q ?? '', suggestions: [] })

    const rx = new RegExp(escapeRegex(q), 'i')

    const [restaurants, dishes, cuisines] = await Promise.all([
        Restaurant.find({ isActive: true, name: rx }).select('name slug').limit(5).lean(),
        MenuItem.find({ isAvailable: true, name: rx }).select('name').limit(5).lean(),
        Cuisine.find({ isActive: true, name: rx }).select('name slug').limit(3).lean(),
    ])

    const seenDish = new Set()
    const suggestions = [
        ...restaurants.map((r) => ({ type: 'restaurant', label: r.name, slug: r.slug })),
        ...cuisines.map((c) => ({ type: 'cuisine', label: c.name, slug: c.slug })),
        ...dishes
            .filter((d) => {
                const key = d.name.toLowerCase()
                if (seenDish.has(key)) return false
                seenDish.add(key)
                return true
            })
            .map((d) => ({ type: 'dish', label: d.name, slug: null })),
    ].slice(0, 10)

    return sendSuccess(res, { query: q, suggestions })
})
