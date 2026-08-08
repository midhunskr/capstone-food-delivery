import { User } from '../../models/userModel.js'
import { asyncHandler } from '../../utils/asyncHandler.js'
import { sendSuccess } from '../../utils/apiResponse.js'
import { ApiError } from '../../utils/apiError.js'
import { addressDto } from '../../utils/dto.js'

const notFound = () => ApiError.notFound('ADDRESS_NOT_FOUND', "We couldn't find that address.")

const loadUser = async (userId) => {
    const user = await User.findById(userId)
    if (!user) throw ApiError.unauthorized('ACCOUNT_NOT_FOUND', 'Please sign in again.')
    return user
}

/**
 * Exactly one default, always. Called after every mutation so the invariant
 * cannot drift — this is the bug that made the legacy checkout unpredictable.
 */
const enforceSingleDefault = (user, preferredId) => {
    if (user.addresses.length === 0) return

    let chosen = preferredId
        ? user.addresses.id(preferredId)
        : user.addresses.find((a) => a.isDefault)

    // Nothing marked default (first address, or the default was just deleted):
    // fall back to the most recently added.
    if (!chosen) chosen = user.addresses[user.addresses.length - 1]

    for (const address of user.addresses) {
        address.isDefault = address._id.equals(chosen._id)
    }
}

/** GET /api/v2/addresses */
export const listAddresses = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user.id).select('addresses').lean()
    if (!user) throw ApiError.unauthorized('ACCOUNT_NOT_FOUND', 'Please sign in again.')

    // Default first, then newest.
    const addresses = [...(user.addresses ?? [])].sort((a, b) => {
        if (a.isDefault !== b.isDefault) return a.isDefault ? -1 : 1
        return new Date(b.createdAt) - new Date(a.createdAt)
    })

    return sendSuccess(res, addresses.map(addressDto))
})

/** POST /api/v2/addresses */
export const createAddress = asyncHandler(async (req, res) => {
    const user = await loadUser(req.user.id)

    if (user.addresses.length >= 10) {
        throw ApiError.badRequest('ADDRESS_LIMIT',
            'You can save up to 10 addresses. Remove one to add another.')
    }

    const { isDefault, ...fields } = req.body
    user.addresses.push(fields)
    const created = user.addresses[user.addresses.length - 1]

    // The first address a person saves is always their default.
    const makeDefault = isDefault || user.addresses.length === 1
    enforceSingleDefault(user, makeDefault ? created._id : undefined)

    await user.save()
    return sendSuccess(res, addressDto(created), { status: 201 })
})

/** PATCH /api/v2/addresses/:id */
export const updateAddress = asyncHandler(async (req, res) => {
    const user = await loadUser(req.user.id)

    // .id() only searches this user's own subdocuments, so another user's
    // address id simply doesn't resolve.
    const address = user.addresses.id(req.params.id)
    if (!address) throw notFound()

    const { isDefault, ...fields } = req.body
    for (const [key, value] of Object.entries(fields)) address[key] = value

    enforceSingleDefault(user, isDefault ? address._id : undefined)

    await user.save()
    return sendSuccess(res, addressDto(address))
})

/** DELETE /api/v2/addresses/:id */
export const deleteAddress = asyncHandler(async (req, res) => {
    const user = await loadUser(req.user.id)

    const address = user.addresses.id(req.params.id)
    if (!address) throw notFound()

    const wasDefault = address.isDefault
    address.deleteOne()

    // Deleting the default promotes another address rather than leaving the
    // account with no default at all.
    if (wasDefault) enforceSingleDefault(user)

    await user.save()
    return sendSuccess(res, { id: req.params.id, deleted: true })
})

/** POST /api/v2/addresses/:id/default */
export const setDefaultAddress = asyncHandler(async (req, res) => {
    const user = await loadUser(req.user.id)

    const address = user.addresses.id(req.params.id)
    if (!address) throw notFound()

    enforceSingleDefault(user, address._id)
    await user.save()

    return sendSuccess(res, addressDto(address))
})
