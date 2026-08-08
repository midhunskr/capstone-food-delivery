import { ApiError, ERROR_CODES } from '../../utils/apiError.js'

/**
 * Zod validation middleware.
 *
 * Pass a schema per request part; whatever you pass gets validated and the
 * parsed (coerced, trimmed, normalized) result replaces the original. Controllers
 * therefore always work with clean data and never re-check shapes.
 *
 *   validate({ body: registerSchema })
 *   validate({ query: listSchema, params: idSchema })
 */
export const validate = (schemas) => (req, res, next) => {
    const details = {}

    for (const part of ['body', 'query', 'params']) {
        const schema = schemas[part]
        if (!schema) continue

        const result = schema.safeParse(req[part])

        if (result.success) {
            // req.query is a getter on newer Express versions, so assign defensively.
            try {
                req[part] = result.data
            } catch {
                Object.defineProperty(req, part, { value: result.data, configurable: true })
            }
            continue
        }

        for (const issue of result.error.issues) {
            const field = issue.path.join('.') || part
            if (!details[field]) details[field] = issue.message
        }
    }

    if (Object.keys(details).length > 0) {
        return next(ApiError.badRequest(
            ERROR_CODES.VALIDATION_FAILED,
            'Please check the highlighted fields.',
            details
        ))
    }

    return next()
}
