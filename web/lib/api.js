import 'server-only'
import { cookies } from 'next/headers'
import { SESSION_COOKIE } from './session'

const API_URL = process.env.API_URL || 'http://localhost:3000'

/**
 * Server-side calls to the Express API.
 *
 * The browser never talks to Express — it talks to this app, same-origin. That
 * keeps the JWT out of client JavaScript and removes cross-site cookie problems
 * entirely.
 *
 * Returns a plain result rather than throwing, so pages can render a real error
 * state instead of blowing up the whole route.
 */
export const apiFetch = async (path, { method = 'GET', body, auth = false, revalidate } = {}) => {
    const headers = {}
    if (body !== undefined) headers['Content-Type'] = 'application/json'

    if (auth) {
        const token = (await cookies()).get(SESSION_COOKIE)?.value
        if (token) headers.Authorization = `Bearer ${token}`
    }

    try {
        const res = await fetch(`${API_URL}/api/v2${path}`, {
            method,
            headers,
            body: body === undefined ? undefined : JSON.stringify(body),
            ...(revalidate === undefined ? { cache: 'no-store' } : { next: { revalidate } }),
        })

        const json = await res.json().catch(() => null)

        if (!res.ok || !json?.ok) {
            return {
                ok: false,
                status: res.status,
                error: json?.error ?? { code: 'NETWORK', message: 'Something went wrong. Please try again.' },
            }
        }

        return { ok: true, status: res.status, data: json.data, meta: json.meta }
    } catch {
        // Express down, DNS failure, timeout — all the same to the user.
        return {
            ok: false,
            status: 503,
            error: { code: 'UNREACHABLE', message: "We couldn't reach the kitchen. Please try again." },
        }
    }
}

export const buildQuery = (params = {}) => {
    const search = new URLSearchParams()
    for (const [key, value] of Object.entries(params)) {
        if (value === undefined || value === null || value === '' || value === false) continue
        search.set(key, Array.isArray(value) ? value.join(',') : String(value))
    }
    const qs = search.toString()
    return qs ? `?${qs}` : ''
}
