'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { Check, MapPin, Receipt } from 'lucide-react'
import { currency } from '@/config/product'
import { fetchOrder } from '@/lib/client'
import { SmartImage } from '@/components/ui/SmartImage'
import { restaurantImage } from '@/lib/foodImages'
import { VegMark } from '@/components/ui/Bits'
import { Button } from '@/components/ui/Button'
import { BillDetails } from '@/components/checkout/BillDetails'
import { OrderTracker, STATUS_COPY, StatusBadge } from './OrderStatus'
import { ReorderButton } from './ReorderButton'
import { formatAddress, formatRegion } from '@/components/address/AddressCard'

const ACTIVE = ['confirmed', 'preparing', 'on_the_way']

/**
 * Order detail and tracking.
 *
 * Polls while the order is still moving so a reviewer can watch it progress,
 * and stops once it's delivered. Arriving straight from payment shows a
 * restrained confirmation — the one moment MORO is allowed to be expressive.
 */
export function OrderDetailView({ initialOrder }) {
    const [order, setOrder] = useState(initialOrder)

    // The confirmation belongs to the arrival from payment, not to every later
    // visit. Reading is pure — a useState initializer can run more than once
    // under concurrent rendering, so consuming the marker there would swallow
    // it. Clearing happens once, in an effect, after the banner has rendered.
    const [justPlaced, setJustPlaced] = useState(false)

    useEffect(() => {
        let cancelled = false
        // Deferred a tick so the state update isn't synchronous in the effect
        // body, which would cascade a render.
        const timer = setTimeout(() => {
            try {
                if (cancelled) return
                if (sessionStorage.getItem('moro.justPlaced') !== initialOrder.orderNumber) return
                sessionStorage.removeItem('moro.justPlaced')
                setJustPlaced(true)
            } catch { /* private mode — the page works, just without the flourish */ }
        }, 0)
        return () => { cancelled = true; clearTimeout(timer) }
    }, [initialOrder.orderNumber])

    const isActive = ACTIVE.includes(order.status)

    useEffect(() => {
        if (!isActive) return undefined
        const interval = setInterval(async () => {
            const result = await fetchOrder(order.orderNumber)
            if (result.ok) setOrder(result.data)
        }, 10000)
        return () => clearInterval(interval)
    }, [isActive, order.orderNumber])

    const eta = order.estimatedMinutes
        ? `${order.estimatedMinutes.min}–${order.estimatedMinutes.max} min`
        : null

    return (
        <div className="mx-auto max-w-(--container-page) px-4 pb-8 sm:px-6">
            <AnimatePresence>
                {justPlaced && (
                    <motion.div
                        initial={{ opacity: 0, y: -8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, height: 0, marginTop: 0, marginBottom: 0 }}
                        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                        className="mt-6 overflow-hidden"
                    >
                        <div className="flex items-center gap-3 rounded-2xl bg-veg/8 p-4">
                            <motion.span
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ type: 'spring', stiffness: 460, damping: 18, delay: 0.1 }}
                                className="grid size-10 shrink-0 place-items-center rounded-full bg-veg text-white"
                            >
                                <Check className="size-5" strokeWidth={3.5} />
                            </motion.span>
                            <div>
                                <p className="text-lg font-extrabold text-veg">Your order&apos;s in</p>
                                <p className="text-sm text-ink-600">
                                    {order.restaurant.name} is getting started.
                                </p>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <header className="pt-6">
                <div className="flex flex-wrap items-center gap-3">
                    <h1 className="text-[1.5rem] font-extrabold tracking-tight sm:text-2xl">
                        {STATUS_COPY[order.status]?.title ?? 'Your order'}
                    </h1>
                    <StatusBadge status={order.status} />
                </div>
                <p className="mt-1 text-[0.95rem] text-ink-500">
                    Order #{order.orderNumber}
                    {isActive && eta && <> · Arriving in {eta}</>}
                    {order.status === 'delivered' && order.deliveredAt && (
                        <> · Delivered {new Date(order.deliveredAt).toLocaleTimeString('en-IN',
                            { hour: 'numeric', minute: '2-digit' })}</>
                    )}
                </p>
            </header>

            <div className="mt-6 grid gap-5 lg:grid-cols-[minmax(0,1fr)_23rem] lg:items-start">
                <div className="space-y-5">
                    <section className="rounded-2xl border border-sand-200 bg-surface p-5">
                        <h2 className="mb-4 text-sm font-bold uppercase tracking-wide text-ink-400">
                            Progress
                        </h2>
                        <OrderTracker status={order.status} />
                    </section>

                    <section className="rounded-2xl border border-sand-200 bg-surface">
                        <div className="flex items-center gap-3 border-b border-sand-200 p-4">
                            <RestaurantThumb
                                slug={order.restaurant.slug}
                                name={order.restaurant.name}
                            />
                            <div className="min-w-0">
                                <Link
                                    href={`/restaurants/${order.restaurant.slug}`}
                                    className="press block truncate font-extrabold hover:text-paprika-600"
                                >
                                    {order.restaurant.name}
                                </Link>
                                {order.restaurant.area && (
                                    <p className="truncate text-sm text-ink-400">{order.restaurant.area}</p>
                                )}
                            </div>
                        </div>

                        <ul className="divide-y divide-sand-200 px-4">
                            {order.items.map((item) => (
                                <li key={item.menuItemId} className="flex items-center gap-3 py-3.5">
                                    <VegMark isVeg={item.isVeg} className="mt-0.5 shrink-0" />
                                    <div className="min-w-0 flex-1">
                                        <p className="truncate text-[0.95rem] font-semibold">{item.name}</p>
                                        <p className="text-sm text-ink-400">
                                            {currency.format(item.unitPrice)} × {item.quantity}
                                        </p>
                                    </div>
                                    <p className="shrink-0 text-sm font-bold tabular-nums">
                                        {currency.format(item.lineTotal)}
                                    </p>
                                </li>
                            ))}
                        </ul>
                    </section>

                    {order.deliveryAddress && (
                        <section className="rounded-2xl border border-sand-200 bg-surface p-4">
                            <h2 className="mb-2 text-sm font-bold uppercase tracking-wide text-ink-400">
                                Delivering to
                            </h2>
                            <div className="flex gap-3">
                                <MapPin className="mt-0.5 size-4.5 shrink-0 text-ink-400" />
                                <div className="min-w-0 text-[0.95rem] leading-relaxed text-ink-600">
                                    {order.deliveryAddress.recipientName && (
                                        <p className="font-semibold text-ink-900">
                                            {order.deliveryAddress.recipientName}
                                        </p>
                                    )}
                                    <p>{formatAddress(order.deliveryAddress)}</p>
                                    <p className="text-ink-500">{formatRegion(order.deliveryAddress)}</p>
                                </div>
                            </div>
                        </section>
                    )}
                </div>

                <aside className="space-y-4 lg:sticky lg:top-24">
                    <BillDetails pricing={order.pricing} />

                    <div className="rounded-2xl border border-sand-200 bg-surface p-4">
                        <div className="flex items-center gap-2.5">
                            <Receipt className="size-4.5 shrink-0 text-ink-400" />
                            <p className="text-sm text-ink-600">
                                {order.payment.status === 'paid'
                                    ? <>Paid{order.payment.method ? ` by ${order.payment.method.toUpperCase()}` : ''}</>
                                    : 'Payment pending'}
                            </p>
                        </div>
                        {order.offer && (
                            <p className="mt-2 text-sm font-semibold text-veg">
                                {currency.format(order.offer.savings)} saved with {order.offer.code ?? order.offer.title}
                            </p>
                        )}
                    </div>

                    <div className="flex flex-col gap-2.5">
                        <ReorderButton orderNumber={order.orderNumber} />
                        <Button as={Link} href="/orders" variant="ghost" className="w-full">
                            All orders
                        </Button>
                    </div>
                </aside>
            </div>
        </div>
    )
}

/** Restaurant thumbnail on the order screen, from the central photography map. */
function RestaurantThumb({ slug, name }) {
    const photo = restaurantImage(slug)

    return (
        <div className="relative size-11 shrink-0 overflow-hidden rounded-xl bg-sand-100">
            <SmartImage src={photo.src} alt={photo.alt || name} focus={photo.focus} sizes="66px" />
        </div>
    )
}
