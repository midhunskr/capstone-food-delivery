'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { AnimatePresence, motion } from 'motion/react'
import { ArrowRight, ShoppingBag } from 'lucide-react'
import { cartCount, cartSubtotal, useCart } from '@/lib/cart'
import { currency } from '@/config/product'

/**
 * Sticky cart summary. Appears the moment something is in the cart and follows
 * the user around while they keep browsing.
 *
 * The amount shown is the cached display subtotal — deliberately labelled as
 * items, not "to pay". The real total is the server quote at checkout.
 *
 * Hidden on the cart and checkout routes, where it would be redundant, and it
 * sits above the mobile nav rather than covering it.
 */
export function CartBar() {
    const cart = useCart()
    const pathname = usePathname()

    const count = cartCount(cart)
    const hidden = pathname === '/cart' || pathname.startsWith('/checkout') || count === 0

    return (
        <AnimatePresence>
            {!hidden && (
                <motion.div
                    initial={{ y: 90, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: 90, opacity: 0 }}
                    transition={{ type: 'spring', damping: 28, stiffness: 320 }}
                    className="safe-bottom fixed inset-x-0 bottom-[4.25rem] z-40 px-3 md:bottom-5"
                >
                    <Link
                        href="/cart"
                        className="press mx-auto flex h-14 max-w-lg items-center gap-3 rounded-2xl bg-paprika-500 px-4 text-white shadow-lift md:max-w-md"
                    >
                        <span className="relative grid size-9 shrink-0 place-items-center rounded-xl bg-white/15">
                            <ShoppingBag className="size-[1.15rem]" strokeWidth={2.3} />
                        </span>

                        <span className="min-w-0 flex-1 leading-tight">
                            <span className="block text-[0.95rem] font-extrabold">
                                {count} {count === 1 ? 'item' : 'items'} · {currency.format(cartSubtotal(cart))}
                            </span>
                            <span className="block truncate text-xs text-white/80">
                                {cart.restaurantName}
                            </span>
                        </span>

                        <span className="flex shrink-0 items-center gap-1 text-[0.95rem] font-extrabold">
                            View cart
                            <ArrowRight className="size-4" strokeWidth={2.6} />
                        </span>
                    </Link>
                </motion.div>
            )}
        </AnimatePresence>
    )
}
