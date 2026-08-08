import mongoose from 'mongoose'
import { env } from '../../config/env.js'
import { sendError } from '../../utils/apiResponse.js'
import { ERROR_CODES } from '../../utils/apiError.js'

const isV2Request = (req) => req.originalUrl.startsWith('/api/v2')

/**
 * 404 for API routes that do not exist.
 *
 * v2 gets the standard envelope. v1 gets a shape close to what its own
 * controllers return, so the legacy frontend is not surprised.
 */
export const notFoundHandler = (req, res, next) => {
    if (isV2Request(req)) {
        return sendError(res, {
            status: 404,
            code: ERROR_CODES.ROUTE_NOT_FOUND,
            message: "That endpoint doesn't exist.",
        })
    }

    if (req.originalUrl.startsWith('/api')) {
        return res.status(404).json({ success: false, message: 'Route not found' })
    }

    return next()
}

/**
 * Global error handler.
 *
 * Rules that matter:
 *  - user-facing message only; never a stack trace, Mongo internal, or provider error
 *  - full detail goes to the server log, not the response
 *  - v2 responses use the envelope, v1 keeps its legacy shape
 */
// eslint-disable-next-line no-unused-vars -- Express identifies error handlers by arity
export const errorHandler = (err, req, res, next) => {
    if (res.headersSent) return next(err)

    let status = err.status || 500
    let code = err.code || ERROR_CODES.SERVER_ERROR
    let message = 'Something went wrong on our end. Please try again.'
    let details = err.details

    if (err.isApiError) {
        message = err.message
    } else if (err instanceof mongoose.Error.ValidationError) {
        status = 400
        code = ERROR_CODES.VALIDATION_FAILED
        message = 'Please check the highlighted fields.'
        details = Object.fromEntries(
            Object.entries(err.errors).map(([field, e]) => [field, e.message])
        )
    } else if (err instanceof mongoose.Error.CastError) {
        status = 400
        code = ERROR_CODES.VALIDATION_FAILED
        message = "That doesn't look like a valid ID."
        details = undefined
    } else if (err.code === 11000) {
        // Duplicate key. Never echo the offending value back.
        status = 409
        code = ERROR_CODES.EMAIL_TAKEN
        message = 'That is already taken.'
        details = undefined
    } else if (err.type === 'entity.too.large') {
        status = 413
        code = ERROR_CODES.PAYLOAD_TOO_LARGE
        message = 'That request was too large.'
        details = undefined
    } else if (err.type === 'entity.parse.failed') {
        status = 400
        code = ERROR_CODES.VALIDATION_FAILED
        message = "We couldn't read that request."
        details = undefined
    }

    // Log the real thing server-side. 4xx is usually just a user mistake, so keep
    // it quiet; 5xx means we have a bug and deserves the stack.
    if (status >= 500) {
        console.error(`[${req.method} ${req.originalUrl}]`, err)
    } else if (!env.isProduction) {
        console.warn(`[${req.method} ${req.originalUrl}] ${code}: ${err.message}`)
    }

    if (isV2Request(req)) {
        return sendError(res, { status, code, message, details })
    }

    return res.status(status).json({
        success: false,
        message: err.isApiError ? err.message : 'Internal server error',
    })
}
