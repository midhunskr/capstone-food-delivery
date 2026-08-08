import bcrypt from 'bcrypt'
import { User } from '../../models/userModel.js'
import { asyncHandler } from '../../utils/asyncHandler.js'
import { sendSuccess } from '../../utils/apiResponse.js'
import { ApiError, ERROR_CODES } from '../../utils/apiError.js'
import { signAccessToken } from '../../services/tokenService.js'

const SALT_ROUNDS = 10

/**
 * The only shape a user is ever returned in. Note what is absent: the password
 * hash, __v, and anything else internal.
 */
const toPublicUser = (user) => ({
    id: user._id.toString(),
    name: user.name ?? null,
    email: user.email,
    phone: user.phone ?? null,
    role: user.role || 'user',
})

/**
 * POST /api/v2/auth/register
 */
export const register = asyncHandler(async (req, res) => {
    const { name, email, password, phone } = req.body

    const existing = await User.findOne({ email }).select('_id').lean()
    if (existing) {
        throw ApiError.conflict(
            ERROR_CODES.EMAIL_TAKEN,
            'An account already uses that email. Try signing in instead.'
        )
    }

    const passwordHash = await bcrypt.hash(password, SALT_ROUNDS)

    // `password` is the legacy storage field and holds the bcrypt hash. Renaming
    // it to `passwordHash` would mean migrating every existing document and
    // touching v1 login for no functional gain — see docs/BACKEND.md.
    const user = await User.create({
        name,
        email,
        password: passwordHash,
        phone,
        role: 'user',
    })

    const token = signAccessToken({ userId: user._id, role: user.role })

    return sendSuccess(res, { user: toPublicUser(user), token }, { status: 201 })
})

/**
 * POST /api/v2/auth/login
 */
export const login = asyncHandler(async (req, res) => {
    const { email, password } = req.body

    const user = await User.findOne({ email }).select('+password')

    // Same error and same shape whether the email is unknown or the password is
    // wrong — otherwise this endpoint tells an attacker which emails exist.
    const invalid = ApiError.unauthorized(
        ERROR_CODES.INVALID_CREDENTIALS,
        "That email and password don't match."
    )

    if (!user || !user.password) throw invalid

    const passwordMatches = await bcrypt.compare(password, user.password)
    if (!passwordMatches) throw invalid

    const token = signAccessToken({ userId: user._id, role: user.role })

    return sendSuccess(res, { user: toPublicUser(user), token })
})

/**
 * GET /api/v2/auth/me
 */
export const me = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user.id).select('-password').lean()

    if (!user) {
        // Valid token, deleted account.
        throw ApiError.unauthorized(
            ERROR_CODES.ACCOUNT_NOT_FOUND,
            'We couldn\'t find your account. Please sign in again.'
        )
    }

    return sendSuccess(res, { user: toPublicUser(user) })
})

/**
 * POST /api/v2/auth/logout
 *
 * Express holds no session state — the JWT is stateless and the browser cookie
 * belongs to the Next.js BFF, which clears it on its own side. So this endpoint
 * exists to give the BFF a single call to make, and to be the natural place to
 * hang token revocation if we ever add it.
 */
export const logout = asyncHandler(async (req, res) =>
    sendSuccess(res, { message: 'Signed out.' })
)
