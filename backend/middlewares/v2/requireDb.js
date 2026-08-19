import { isDbConnected } from '../../config/db.js'
import { sendError } from '../../utils/apiResponse.js'
import { ERROR_CODES } from '../../utils/apiError.js'

/**
 * Guards routes that need MongoDB.
 *
 * The server now starts listening before Mongo connects (see index.js), so
 * there's a real window — right after boot, or during a reconnect — where a
 * request can arrive before the database is ready. Previously this could
 * never happen: the process didn't start listening until Mongo was up. Now
 * that it can, routes that need data respond with a clean 503 here instead of
 * hanging on Mongoose's command buffer or throwing a raw driver error.
 *
 * Mounted after /health and /ready, which stay reachable regardless of
 * database state.
 */
export const requireDb = (req, res, next) => {
    if (isDbConnected()) return next()

    return sendError(res, {
        status: 503,
        code: ERROR_CODES.SERVICE_UNAVAILABLE,
        message: "We're reconnecting to the database. Please try again in a moment.",
    })
}
