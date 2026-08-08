/**
 * Error type for v2 routes.
 *
 * `code` is what the frontend branches on. `message` is shown to the user as-is,
 * so it must read like something a person would say — see the UX writing
 * principles in docs/BACKEND.md.
 */
export class ApiError extends Error {
    constructor(status, code, message, details = undefined) {
        super(message)
        this.name = 'ApiError'
        this.status = status
        this.code = code
        this.details = details
        this.isApiError = true
        Error.captureStackTrace?.(this, ApiError)
    }

    static badRequest(code, message, details) {
        return new ApiError(400, code, message, details)
    }

    static unauthorized(code, message, details) {
        return new ApiError(401, code, message, details)
    }

    static forbidden(code, message, details) {
        return new ApiError(403, code, message, details)
    }

    static notFound(code, message, details) {
        return new ApiError(404, code, message, details)
    }

    static conflict(code, message, details) {
        return new ApiError(409, code, message, details)
    }

    static tooManyRequests(code, message, details) {
        return new ApiError(429, code, message, details)
    }
}

/**
 * Machine-readable error codes. Kept in one place so the frontend and backend
 * cannot drift apart on spelling.
 */
export const ERROR_CODES = {
    VALIDATION_FAILED: 'VALIDATION_FAILED',
    EMAIL_TAKEN: 'EMAIL_TAKEN',
    INVALID_CREDENTIALS: 'INVALID_CREDENTIALS',
    AUTH_REQUIRED: 'AUTH_REQUIRED',
    AUTH_INVALID: 'AUTH_INVALID',
    AUTH_EXPIRED: 'AUTH_EXPIRED',
    FORBIDDEN: 'FORBIDDEN',
    ACCOUNT_NOT_FOUND: 'ACCOUNT_NOT_FOUND',
    ROUTE_NOT_FOUND: 'ROUTE_NOT_FOUND',
    RATE_LIMITED: 'RATE_LIMITED',
    PAYLOAD_TOO_LARGE: 'PAYLOAD_TOO_LARGE',
    SERVER_ERROR: 'SERVER_ERROR',
}
