/**
 * The one response shape every v2 endpoint uses.
 *
 *   success: { ok: true, data: ... }              (+ optional meta)
 *   error:   { ok: false, error: { code, message } }
 *
 * v1 keeps its own ad-hoc shapes. Nothing here touches v1.
 */

export const sendSuccess = (res, data, { status = 200, meta } = {}) => {
    const body = { ok: true, data }
    if (meta) body.meta = meta
    return res.status(status).json(body)
}

export const sendError = (res, { status = 500, code, message, details }) => {
    const error = { code, message }
    if (details) error.details = details
    return res.status(status).json({ ok: false, error })
}

/**
 * Builds the `meta` block for paginated lists.
 */
export const buildMeta = ({ page, limit, total }) => ({
    page,
    limit,
    total,
    pages: limit > 0 ? Math.ceil(total / limit) : 0,
})
