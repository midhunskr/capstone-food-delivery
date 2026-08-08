'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { LogOut } from 'lucide-react'
import { Button } from '@/components/ui/Button'

export function SignOutButton() {
    const router = useRouter()
    const [busy, setBusy] = useState(false)

    const signOut = async () => {
        setBusy(true)
        await fetch('/api/auth/logout', { method: 'POST' })
        router.replace('/')
        router.refresh()
    }

    return (
        <Button variant="secondary" className="w-full" onClick={signOut} loading={busy} disabled={busy}>
            <LogOut className="size-4" strokeWidth={2.2} /> Sign out
        </Button>
    )
}
