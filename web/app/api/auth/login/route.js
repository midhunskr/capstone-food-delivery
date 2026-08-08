import { NextResponse } from 'next/server'
import { apiFetch } from '@/lib/api'
import { setSession } from '@/lib/session'

/**
 * Login BFF. Express returns a JWT; we put it straight into the httpOnly
 * session cookie and return only the user to the browser. The token itself
 * never reaches client JavaScript.
 */
export async function POST(request) {
    const body = await request.json().catch(() => ({}))
    const result = await apiFetch('/auth/login', { method: 'POST', body })

    if (!result.ok) {
        return NextResponse.json({ ok: false, error: result.error }, { status: result.status })
    }

    await setSession(result.data.token)
    return NextResponse.json({ ok: true, data: { user: result.data.user } })
}
