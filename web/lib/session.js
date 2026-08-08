import 'server-only'
import { cookies } from 'next/headers'

/**
 * The session cookie holds the Express JWT. httpOnly, so client JavaScript can
 * never read it. Brand-neutral name — it survives the product rename.
 */
export const SESSION_COOKIE = 'app_session'

const THIRTY_DAYS = 60 * 60 * 24 * 30

/**
 * A `Secure` cookie is only stored by the browser over HTTPS (or on localhost,
 * which browsers treat as trustworthy). Keying it off NODE_ENV alone silently
 * drops the session whenever a production build is served over plain HTTP —
 * `npm start` locally, or reaching the dev machine on its LAN address. The
 * symptom is nasty: login looks like it worked, then every authenticated call
 * comes back 401.
 *
 * So flag it explicitly instead: set COOKIE_SECURE=true wherever the app is
 * actually served over HTTPS (Vercel sets it in vercel.json / project env).
 */
const useSecureCookie = process.env.COOKIE_SECURE === 'true'

export const cookieOptions = () => ({
    httpOnly: true,
    secure: useSecureCookie,
    sameSite: 'lax',
    path: '/',
    maxAge: THIRTY_DAYS,
})

export const setSession = async (token) => {
    (await cookies()).set(SESSION_COOKIE, token, cookieOptions())
}

export const clearSession = async () => {
    (await cookies()).set(SESSION_COOKIE, '', { ...cookieOptions(), maxAge: 0 })
}

export const hasSession = async () => Boolean((await cookies()).get(SESSION_COOKIE)?.value)

/**
 * Current user, or null. Used by the shell to decide what the account menu
 * shows. Never throws — a signed-out visitor is a normal state, not an error.
 */
export const getCurrentUser = async () => {
    if (!(await hasSession())) return null
    const { apiFetch } = await import('./api')
    const result = await apiFetch('/auth/me', { auth: true })
    return result.ok ? result.data.user : null
}
