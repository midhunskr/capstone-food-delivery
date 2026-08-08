import { User } from '../../models/userModel.js'
import { asyncHandler } from '../../utils/asyncHandler.js'
import { sendSuccess } from '../../utils/apiResponse.js'
import { ApiError } from '../../utils/apiError.js'
import { addressDto } from '../../utils/dto.js'
import { availableOffersFor, buildQuote } from '../../services/pricing.js'

/**
 * POST /api/v2/checkout/quote
 *
 * Authoritative pricing for a cart. Creates nothing — no order, no payment.
 * Block E turns an accepted quote into an order.
 */
export const createQuote = asyncHandler(async (req, res) => {
    const { restaurantId, items, offerCode, addressId } = req.body

    const quote = await buildQuote({ restaurantId, items, offerCode })

    // Address is optional for pricing (delivery fee is per-restaurant, not
    // distance-based yet) but is resolved and returned so checkout can show
    // exactly where this order is going.
    let address = null
    if (addressId) {
        const user = await User.findById(req.user.id).select('addresses').lean()
        const found = user?.addresses?.find((a) => a._id.toString() === addressId)
        if (!found) {
            throw ApiError.notFound('ADDRESS_NOT_FOUND',
                "We couldn't find that address. Pick another one.")
        }
        address = addressDto(found)
    }

    const offers = await availableOffersFor({
        restaurantId: quote.restaurant.id,
        subtotal: quote.pricing.subtotal,
    })

    return sendSuccess(res, { ...quote, address, availableOffers: offers })
})
