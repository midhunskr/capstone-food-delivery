import { verifyAccessToken } from '../../services/tokenService.js'
import { ApiError, ERROR_CODES } from '../../utils/apiError.js'

/**
 * Bearer authentication for v2.
 *
 * The browser never calls Express directly — the Next.js BFF holds the session
 * cookie and forwards the JWT as `Authorization: Bearer <token>`. So there is no
 * cookie handling here at all; that stays in v1.
 *
 * req.user is normalized to { id, role } exactly once, right here. v2 code reads
 * req.user.id and nothing else. (Mixing req.user.id and req.user._id is what
 * silently broke getOrderById and createRestaurant in v1.)
 */

const extractBearerToken = (req) => {
    const header = req.headers.authorization || ''
    if (!header.startsWith('Bearer ')) return null
    const token = header.slice(7).trim()
    return token.length > 0 ? token : null
}

export const authenticate = (req, res, next) => {
    const token = extractBearerToken(req)

    if (!token) {
        return next(ApiError.unauthorized(
            ERROR_CODES.AUTH_REQUIRED,
            'You need to be signed in to do that.'
        ))
    }

    try {
        const { id, role } = verifyAccessToken(token)

        if (!id) {
            return next(ApiError.unauthorized(
                ERROR_CODES.AUTH_INVALID,
                'Your session is no longer valid. Please sign in again.'
            ))
        }

        req.user = { id, role: role || 'user' }
        return next()
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return next(ApiError.unauthorized(
                ERROR_CODES.AUTH_EXPIRED,
                'Your session has expired. Please sign in again.'
            ))
        }
        return next(ApiError.unauthorized(
            ERROR_CODES.AUTH_INVALID,
            'Your session is no longer valid. Please sign in again.'
        ))
    }
}

/**
 * Optional authentication: attaches req.user when a valid token is present and
 * otherwise carries on anonymously. Discovery endpoints will use this later so
 * signed-in users get personalised results without gating browsing behind login.
 */
export const optionalAuthenticate = (req, res, next) => {
    const token = extractBearerToken(req)
    if (!token) return next()

    try {
        const { id, role } = verifyAccessToken(token)
        if (id) req.user = { id, role: role || 'user' }
    } catch {
        // A bad token on an optional route just means "treat them as a guest".
    }
    return next()
}

/**
 * Role gate. Roles in v2 are 'user' and 'admin'; v1's 'delivery' role is left
 * untouched in the legacy middleware.
 */
export const requireRole = (...roles) => (req, res, next) => {
    if (!req.user) {
        return next(ApiError.unauthorized(
            ERROR_CODES.AUTH_REQUIRED,
            'You need to be signed in to do that.'
        ))
    }
    if (!roles.includes(req.user.role)) {
        return next(ApiError.forbidden(
            ERROR_CODES.FORBIDDEN,
            "You don't have access to this."
        ))
    }
    return next()
}
