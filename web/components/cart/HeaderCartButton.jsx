'use client'

import Link from 'next/link'
import { AnimatePresence, motion } from 'motion/react'
import { ShoppingBag } from 'lucide-react'
import { cartCount, useCart } from '@/lib/cart'

/**
 * Desktop cart affordance. The count badge pops when it changes so adding
 * something from anywhere on the page is acknowledged up here too.
 */
export function HeaderCartButton() {
    const count = cartCount(useCart())

    return (
        <Link
            href="/cart"
            aria-label={count > 0 ? `Cart, ${count} ${count === 1 ? 'item' : 'items'}` : 'Cart'}
            className="press relative hidden size-10 shrink-0 place-items-center rounded-full text-ink-600 hover:bg-sand-100 md:grid"
        >
            <ShoppingBag className="size-[1.15rem]" strokeWidth={2.1} />

            <AnimatePresence>
                {count > 0 && (
                    <motion.span
                        key="badge"
                        initial={{ scale: 0.4, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.4, opacity: 0 }}
                        transition={{ type: 'spring', stiffness: 520, damping: 22 }}
                        className="absolute -right-0.5 -top-0.5 grid min-w-5 place-items-center rounded-full bg-paprika-500 px-1 text-[0.68rem] font-extrabold tabular-nums text-white"
                    >
                        <motion.span key={count} initial={{ y: -6 }} animate={{ y: 0 }} transition={{ duration: 0.14 }}>
                            {count}
                        </motion.span>
                    </motion.span>
                )}
            </AnimatePresence>
        </Link>
    )
}
