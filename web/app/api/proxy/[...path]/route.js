import { NextResponse } from 'next/server'
import { apiFetch } from '@/lib/api'

/**
 * Same-origin proxy to the Express API for client components.
 *
 * The browser never sees the API URL or the JWT — the token is read from the
 * httpOnly session cookie here, server-side, and forwarded as a Bearer header.
 *
 * Auth routes are deliberately NOT proxied through here: /api/auth/* has its
 * own handlers because those need to set or clear the session cookie. Express
 * still enforces authentication, ownership and validation on everything below.
 */
const forward = async (request, params, method) => {
    const { path } = await params
    const body = method === 'GET' || method === 'DELETE'
        ? undefined
        : await request.json().catch(() => ({}))

    const result = await apiFetch(`/${path.join('/')}${request.nextUrl.search}`, {
        method,
        body,
        auth: true,
    })

    if (!result.ok) {
        return NextResponse.json({ ok: false, error: result.error }, { status: result.status })
    }
    return NextResponse.json({ ok: true, data: result.data, meta: result.meta }, { status: result.status })
}

export const GET = (request, { params }) => forward(request, params, 'GET')
export const POST = (request, { params }) => forward(request, params, 'POST')
export const PATCH = (request, { params }) => forward(request, params, 'PATCH')
export const DELETE = (request, { params }) => forward(request, params, 'DELETE')
