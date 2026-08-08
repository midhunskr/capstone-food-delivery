'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { LogOut, ReceiptText, User } from 'lucide-react'
import { Button } from '@/components/ui/Button'

export function AccountMenu({ user }) {
    const [open, setOpen] = useState(false)
    const [busy, setBusy] = useState(false)
    const ref = useRef(null)
    const router = useRouter()

    useEffect(() => {
        if (!open) return
        const onClick = (e) => { if (!ref.current?.contains(e.target)) setOpen(false) }
        const onKey = (e) => { if (e.key === 'Escape') setOpen(false) }
        document.addEventListener('mousedown', onClick)
        document.addEventListener('keydown', onKey)
        return () => {
            document.removeEventListener('mousedown', onClick)
            document.removeEventListener('keydown', onKey)
        }
    }, [open])

    const signOut = async () => {
        setBusy(true)
        await fetch('/api/auth/logout', { method: 'POST' })
        setOpen(false)
        setBusy(false)
        router.refresh()
    }

    if (!user) {
        return (
            <div className="flex items-center gap-2">
                {/* The hidden utility has to sit on a wrapper: Button sets its own
                    display, and same-layer utilities would fight over it — which
                    left both buttons rendered at 320px and pushed the header wide. */}
                <span className="hidden sm:contents">
                    <Button as={Link} href="/login" variant="ghost" size="sm">
                        Sign in
                    </Button>
                </span>
                <Button as={Link} href="/register" size="sm">Sign up</Button>
            </div>
        )
    }

    const initial = (user.name || user.email).trim().charAt(0).toUpperCase()
    const firstName = (user.name || '').split(' ')[0]

    return (
        <div className="relative" ref={ref}>
            <button
                onClick={() => setOpen((v) => !v)}
                aria-haspopup="menu"
                aria-expanded={open}
                className="press flex items-center gap-2 rounded-pill py-1 pl-1 pr-1 hover:bg-sand-100 sm:pr-3"
            >
                <span className="grid size-9 place-items-center rounded-full bg-paprika-100 text-sm font-bold text-paprika-700">
                    {initial}
                </span>
                <span className="hidden max-w-24 truncate text-sm font-semibold sm:block">{firstName}</span>
            </button>

            <AnimatePresence>
                {open && (
                    <motion.div
                        role="menu"
                        initial={{ opacity: 0, y: -6, scale: 0.98 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -6, scale: 0.98 }}
                        transition={{ duration: 0.16, ease: [0.22, 1, 0.36, 1] }}
                        className="absolute right-0 top-[calc(100%+0.5rem)] w-56 overflow-hidden rounded-2xl border border-sand-200 bg-surface shadow-lift"
                    >
                        <div className="border-b border-sand-200 px-4 py-3">
                            <p className="truncate text-sm font-bold">{user.name}</p>
                            <p className="truncate text-xs text-ink-400">{user.email}</p>
                        </div>
                        <div className="p-1.5">
                            <MenuLink href="/account" icon={User} onClick={() => setOpen(false)}>Account</MenuLink>
                            <MenuLink href="/orders" icon={ReceiptText} onClick={() => setOpen(false)}>Orders</MenuLink>
                            <button
                                role="menuitem"
                                onClick={signOut}
                                disabled={busy}
                                className="press flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-left text-[0.95rem] font-medium text-ink-600 hover:bg-sand-100 hover:text-ink-900 disabled:opacity-50"
                            >
                                <LogOut className="size-[1.05rem]" /> Sign out
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}

function MenuLink({ href, icon: Icon, children, onClick }) {
    return (
        <Link
            role="menuitem"
            href={href}
            onClick={onClick}
            className="press flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-[0.95rem] font-medium text-ink-600 hover:bg-sand-100 hover:text-ink-900"
        >
            <Icon className="size-[1.05rem]" /> {children}
        </Link>
    )
}
