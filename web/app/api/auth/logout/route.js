import { NextResponse } from 'next/server'
import { apiFetch } from '@/lib/api'
import { clearSession } from '@/lib/session'

export async function POST() {
    // Tell Express for completeness, then drop the cookie regardless — the user
    // asked to sign out and that must always succeed.
    await apiFetch('/auth/logout', { method: 'POST', auth: true })
    await clearSession()
    return NextResponse.json({ ok: true, data: { message: 'Signed out.' } })
}
