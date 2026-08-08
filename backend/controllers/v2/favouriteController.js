import { User } from '../../models/userModel.js'
import { Restaurant } from '../../models/v2/restaurant.js'
import { asyncHandler } from '../../utils/asyncHandler.js'
import { sendSuccess } from '../../utils/apiResponse.js'
import { ApiError } from '../../utils/apiError.js'
import { restaurantCard } from '../../utils/dto.js'
import { getRestaurantOfferMap } from '../../services/restaurantQuery.js'

/**
 * Favourite restaurants, stored as ids on the user — the same embedded pattern
 * as addresses, so ownership needs no extra checking.
 */

/** GET /api/v2/favourites */
export const listFavourites = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user.id).select('favouriteRestaurants').lean()
    const ids = user?.favouriteRestaurants ?? []

    if (ids.length === 0) return sendSuccess(res, [])

    const restaurants = await Restaurant.find({ _id: { $in: ids }, isActive: true }).lean()
    const offerMap = await getRestaurantOfferMap(restaurants.map((r) => r._id))

    return sendSuccess(res, restaurants.map((r) =>
        restaurantCard(r, { offer: offerMap.get(r._id.toString())?.[0] ?? null })))
})

/** POST /api/v2/favourites — toggles, so one control does both directions. */
export const toggleFavourite = asyncHandler(async (req, res) => {
    const { restaurantId } = req.body

    const restaurant = await Restaurant.findById(restaurantId).select('_id').lean()
    if (!restaurant) {
        throw ApiError.notFound('RESTAURANT_NOT_FOUND', "We couldn't find that restaurant.")
    }

    const user = await User.findById(req.user.id).select('favouriteRestaurants')
    if (!user) throw ApiError.unauthorized('ACCOUNT_NOT_FOUND', 'Please sign in again.')

    const existing = user.favouriteRestaurants.findIndex((id) => String(id) === String(restaurantId))
    const isFavourite = existing === -1

    if (isFavourite) user.favouriteRestaurants.push(restaurant._id)
    else user.favouriteRestaurants.splice(existing, 1)

    await user.save()
    return sendSuccess(res, { restaurantId, isFavourite })
})
