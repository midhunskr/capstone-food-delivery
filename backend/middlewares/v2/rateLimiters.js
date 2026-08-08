import rateLimit from 'express-rate-limit'
import { sendError } from '../../utils/apiResponse.js'
import { ERROR_CODES } from '../../utils/apiError.js'

/**
 * In-memory rate limiting. No Redis — a single Render instance at portfolio
 * scale does not need shared state, and adding it would be complexity for its
 * own sake.
 */

const limitResponse = (message) => (req, res) =>
    sendError(res, { status: 429, code: ERROR_CODES.RATE_LIMITED, message })

/**
 * Login and register. Deliberately strict: these are the endpoints worth
 * brute-forcing.
 */
export const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 20,
    standardHeaders: 'draft-7',
    legacyHeaders: false,
    handler: limitResponse("Too many attempts. Give it a few minutes and try again."),
})

/**
 * Everything else under /api/v2. Loose enough that normal browsing never
 * notices it.
 */
export const generalLimiter = rateLimit({
    windowMs: 60 * 1000,
    limit: 120,
    standardHeaders: 'draft-7',
    legacyHeaders: false,
    handler: limitResponse("You're going a bit fast. Try again in a moment."),
})
