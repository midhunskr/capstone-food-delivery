'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion } from 'motion/react'
import { Home, ReceiptText, Search, Store } from 'lucide-react'
import { cn } from '@/lib/cn'

const items = [
    { href: '/', label: 'Home', icon: Home },
    { href: '/search', label: 'Search', icon: Search },
    { href: '/restaurants', label: 'Browse', icon: Store },
    { href: '/orders', label: 'Orders', icon: ReceiptText },
]

/**
 * Mobile bottom navigation. Icons always carry labels — nobody should have to
 * guess. The active pill animates between items with a shared layout id.
 */
export function BottomNav() {
    const pathname = usePathname()

    return (
        <nav
            aria-label="Main"
            className="safe-bottom fixed inset-x-0 bottom-0 z-40 border-t border-sand-200 bg-surface/95 backdrop-blur-md md:hidden"
        >
            <ul className="mx-auto flex max-w-md">
                {items.map(({ href, label, icon: Icon }) => {
                    const active = href === '/' ? pathname === '/' : pathname.startsWith(href)
                    return (
                        <li key={href} className="flex-1">
                            <Link
                                href={href}
                                aria-current={active ? 'page' : undefined}
                                className="press relative flex flex-col items-center gap-1 px-1 pb-2 pt-2.5"
                            >
                                {active && (
                                    <motion.span
                                        layoutId="bottom-nav-active"
                                        className="absolute inset-x-3 top-0 h-0.5 rounded-full bg-paprika-500"
                                        transition={{ type: 'spring', stiffness: 400, damping: 34 }}
                                    />
                                )}
                                <Icon
                                    className={cn('size-[1.35rem] transition-colors',
                                        active ? 'text-paprika-500' : 'text-ink-400')}
                                    strokeWidth={active ? 2.4 : 1.9}
                                />
                                <span className={cn('text-[0.68rem] font-semibold transition-colors',
                                    active ? 'text-paprika-600' : 'text-ink-400')}>
                                    {label}
                                </span>
                            </Link>
                        </li>
                    )
                })}
            </ul>
        </nav>
    )
}
