/**
 * Wraps an async route handler so a rejected promise reaches the global error
 * handler instead of hanging the request.
 *
 * Express 4 does not await handlers, so without this every v2 controller would
 * need its own try/catch — which is exactly the repetition that made the v1
 * controllers inconsistent.
 */
export const asyncHandler = (handler) => (req, res, next) => {
    Promise.resolve(handler(req, res, next)).catch(next)
}
