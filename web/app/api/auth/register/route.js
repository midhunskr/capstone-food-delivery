import { NextResponse } from 'next/server'
import { apiFetch } from '@/lib/api'
import { setSession } from '@/lib/session'

export async function POST(request) {
    const body = await request.json().catch(() => ({}))
    const result = await apiFetch('/auth/register', { method: 'POST', body })

    if (!result.ok) {
        return NextResponse.json({ ok: false, error: result.error }, { status: result.status })
    }

    await setSession(result.data.token)
    return NextResponse.json({ ok: true, data: { user: result.data.user } }, { status: 201 })
}
