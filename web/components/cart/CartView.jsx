'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { Minus, Plus, ShoppingBag, Trash2 } from 'lucide-react'
import {
    cartCount, cartSubtotal, decrementItem, incrementItem, removeItem, useCart,
} from '@/lib/cart'
import { currency } from '@/config/product'
import { SmartImage } from '@/components/ui/SmartImage'
import { VegMark } from '@/components/ui/Bits'
import { dishImage } from '@/lib/foodImages'
import { Button } from '@/components/ui/Button'
import { EmptyState } from '@/components/ui/States'

/**
 * The cart.
 *
 * Totals here are indicative — computed from cached display prices and labelled
 * as such. The authoritative bill is produced by the server at checkout, which
 * is where "to pay" first appears.
 */
export function CartView({ isSignedIn }) {
    const cart = useCart()
    const router = useRouter()
    const [leaving, setLeaving] = useState(false)

    const count = cartCount(cart)

    if (count === 0) {
        return (
            <div className="mx-auto max-w-(--container-page) px-4 sm:px-6">
                <h1 className="pt-8 text-[1.6rem] font-extrabold tracking-tight sm:text-3xl">Your cart</h1>
                <EmptyState
                    icon={ShoppingBag}
                    title="Your cart is empty"
                    message="Find something good to eat."
                    action={<Button as={Link} href="/restaurants">Browse restaurants</Button>}
                />
            </div>
        )
    }

    const subtotal = cartSubtotal(cart)

    const goToCheckout = () => {
        setLeaving(true)
        // Signed-out users get sent to sign in and come straight back here.
        // The cart is local, so it survives the round trip untouched.
        router.push(isSignedIn ? '/checkout' : '/login?next=/checkout')
    }

    return (
        <div className="mx-auto max-w-(--container-page) px-4 sm:px-6">
            <h1 className="pt-8 text-[1.6rem] font-extrabold tracking-tight sm:text-3xl">Your cart</h1>

            <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1fr)_22rem] lg:items-start">
                <section className="rounded-2xl border border-sand-200 bg-surface">
                    <div className="border-b border-sand-200 px-4 py-4 sm:px-5">
                        <p className="text-xs font-bold uppercase tracking-wide text-ink-400">Order from</p>
                        <Link
                            href={`/restaurants/${cart.restaurantSlug}`}
                            className="press mt-0.5 inline-block text-lg font-extrabold hover:text-paprika-600"
                        >
                            {cart.restaurantName}
                        </Link>
                    </div>

                    <ul className="divide-y divide-sand-200 px-4 sm:px-5">
                        <AnimatePresence initial={false}>
                            {cart.items.map((item) => (
                                <motion.li
                                    key={item.menuItemId}
                                    layout
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    exit={{ opacity: 0, height: 0 }}
                                    transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
                                    className="overflow-hidden"
                                >
                                    <div className="flex items-center gap-3 py-4">
                                        <CartLineImage name={item.name} />

                                        <div className="min-w-0 flex-1">
                                            <div className="flex items-start gap-1.5">
                                                <VegMark isVeg={item.isVeg} className="mt-0.5" />
                                                <p className="line-clamp-2 text-[0.95rem] font-bold leading-snug">
                                                    {item.name}
                                                </p>
                                            </div>
                                            <p className="mt-0.5 text-sm text-ink-400">
                                                {currency.format(item.price)} each
                                            </p>
                                        </div>

                                        <div className="flex shrink-0 flex-col items-end gap-1.5">
                                            <Stepper item={item} />
                                            <p className="text-sm font-bold tabular-nums">
                                                {currency.format(item.price * item.quantity)}
                                            </p>
                                        </div>
                                    </div>
                                </motion.li>
                            ))}
                        </AnimatePresence>
                    </ul>

                    <div className="px-4 pb-4 sm:px-5">
                        <Link
                            href={`/restaurants/${cart.restaurantSlug}`}
                            className="press inline-flex h-9 items-center rounded-pill px-3 text-sm font-bold text-paprika-600 hover:bg-paprika-50"
                        >
                            + Add more items
                        </Link>
                    </div>
                </section>

                <aside className="lg:sticky lg:top-24">
                    <div className="rounded-2xl border border-sand-200 bg-surface p-5">
                        <h2 className="text-base font-extrabold">Summary</h2>

                        <dl className="mt-4 space-y-2.5 text-[0.95rem]">
                            <div className="flex justify-between">
                                <dt className="text-ink-500">
                                    Item total ({count} {count === 1 ? 'item' : 'items'})
                                </dt>
                                <dd className="font-semibold tabular-nums">{currency.format(subtotal)}</dd>
                            </div>
                        </dl>

                        <p className="mt-3 text-sm text-ink-400">
                            Delivery, offers and taxes are worked out at checkout.
                        </p>

                        <Button
                            className="mt-5 w-full"
                            size="lg"
                            onClick={goToCheckout}
                            loading={leaving}
                            disabled={leaving}
                        >
                            {isSignedIn ? 'Choose delivery address' : 'Sign in to continue'}
                        </Button>
                    </div>
                </aside>
            </div>
        </div>
    )
}

/**
 * Thumbnail for a cart line. Dishes we have no photograph of get a compact
 * initial tile rather than an empty box, so the row keeps its rhythm.
 */
function CartLineImage({ name }) {
    const photo = dishImage(name)

    if (!photo.src) {
        return (
            <div className="grid size-14 shrink-0 place-items-center rounded-xl bg-sand-100 text-base font-extrabold text-ink-400">
                {name.charAt(0).toUpperCase()}
            </div>
        )
    }

    return (
        <div className="relative size-14 shrink-0 overflow-hidden rounded-xl bg-sand-100">
            <SmartImage src={photo.src} alt={photo.alt} focus={photo.focus} sizes="84px" />
        </div>
    )
}

function Stepper({ item }) {
    return (
        <div className="flex items-center gap-0.5 rounded-xl border-2 border-paprika-200 bg-white p-0.5">
            <motion.button
                whileTap={{ scale: 0.85 }}
                transition={{ duration: 0.12 }}
                onClick={() => decrementItem(item.menuItemId)}
                aria-label={item.quantity === 1 ? `Remove ${item.name}` : `Decrease ${item.name}`}
                className="grid size-8 place-items-center rounded-lg text-paprika-600 hover:bg-paprika-50"
            >
                {item.quantity === 1
                    ? <Trash2 className="size-3.5" strokeWidth={2.4} />
                    : <Minus className="size-3.5" strokeWidth={3} />}
            </motion.button>

            <span
                aria-live="polite"
                aria-label={`Quantity ${item.quantity}`}
                className="min-w-6 overflow-hidden text-center text-sm font-extrabold tabular-nums text-paprika-700"
            >
                <motion.span
                    key={item.quantity}
                    initial={{ y: -8, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.16, ease: [0.22, 1, 0.36, 1] }}
                    className="inline-block"
                >
                    {item.quantity}
                </motion.span>
            </span>

            <motion.button
                whileTap={{ scale: 0.85 }}
                transition={{ duration: 0.12 }}
                onClick={() => incrementItem(item.menuItemId)}
                aria-label={`Increase ${item.name}`}
                className="grid size-8 place-items-center rounded-lg text-paprika-600 hover:bg-paprika-50"
            >
                <Plus className="size-3.5" strokeWidth={3} />
            </motion.button>
        </div>
    )
}
