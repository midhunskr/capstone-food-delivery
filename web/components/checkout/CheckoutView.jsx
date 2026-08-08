'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { AlertTriangle, ShoppingBag } from 'lucide-react'
import { cartCount, clearCart, removeItem, toQuotePayload, useCart } from '@/lib/cart'
import { fetchQuote } from '@/lib/client'
import { currency } from '@/config/product'
import { SmartImage } from '@/components/ui/SmartImage'
import { VegMark } from '@/components/ui/Bits'
import { dishImage } from '@/lib/foodImages'
import { Button } from '@/components/ui/Button'
import { EmptyState, ErrorState } from '@/components/ui/States'
import { AddressPicker } from './AddressPicker'
import { OfferPicker } from './OfferPicker'
import { BillDetails } from './BillDetails'
import { PayButton } from './PayButton'

/**
 * Checkout.
 *
 * Every number on this screen comes from the server quote, which is re-requested
 * whenever the cart, address or offer changes. The client never adds anything up.
 *
 * Payment itself is Block E — the CTA deliberately stops at that boundary rather
 * than pretending to charge anyone.
 */
export function CheckoutView({ initialAddresses }) {
    const cart = useCart()
    const count = cartCount(cart)

    const [addresses, setAddresses] = useState(initialAddresses)
    const [addressId, setAddressId] = useState(
        () => initialAddresses.find((a) => a.isDefault)?.id ?? initialAddresses[0]?.id ?? null)
    const [offerCode, setOfferCode] = useState(null)

    // Identity of the thing being priced. When this changes, whatever we're
    // showing is stale and a fresh quote is on its way.
    const quoteKey = JSON.stringify({
        items: cart.items.map((i) => [i.menuItemId, i.quantity]),
        offerCode: offerCode ?? null,
        addressId: addressId ?? null,
    })

    // Holds the last settled response plus the key it answered, so `loading`
    // and `error` are derived rather than juggled as separate state.
    const [settled, setSettled] = useState(null)
    const [reloadToken, setReloadToken] = useState(0)

    useEffect(() => {
        if (cart.items.length === 0) return undefined

        let cancelled = false

        fetchQuote({ ...toQuotePayload(cart), offerCode, addressId }).then((result) => {
            if (cancelled) return

            setSettled({
                key: quoteKey,
                data: result.ok ? result.data : null,
                error: result.ok ? null : result.error,
            })

            // The server dropped something (sold out, delisted). Reconcile the
            // local cart so what's on screen matches what's actually orderable.
            if (result.ok) {
                for (const warning of result.data.warnings ?? []) {
                    if (warning.menuItemId) removeItem(warning.menuItemId)
                }
            }
        })

        // A newer request supersedes this one; its response is ignored.
        return () => { cancelled = true }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [quoteKey, reloadToken])

    const fresh = settled?.key === quoteKey ? settled : null
    const quote = fresh?.data ?? null
    const error = fresh?.error ?? null
    const loading = cart.items.length > 0 && !fresh

    // These failures mean the saved cart no longer matches the menu, so a retry
    // would fail identically. Everything else is worth retrying.
    const staleCart = ['CART_UNAVAILABLE', 'RESTAURANT_UNAVAILABLE', 'VALIDATION_FAILED']
        .includes(error?.code)

    const retry = () => setReloadToken((n) => n + 1)

    if (count === 0 && !loading) {
        return (
            <div className="mx-auto max-w-(--container-page) px-4 sm:px-6">
                <h1 className="pt-8 text-[1.6rem] font-extrabold tracking-tight sm:text-3xl">Checkout</h1>
                <EmptyState
                    icon={ShoppingBag}
                    title="Your cart is empty"
                    message="Find something good to eat."
                    action={<Button as={Link} href="/restaurants">Browse restaurants</Button>}
                />
            </div>
        )
    }

    const needsAddress = addresses.length === 0 || !addressId
    const canContinue = !!quote && !loading && !needsAddress

    // Ids and quantities only — the server prices it again at payment time.
    const payPayload = {
        ...toQuotePayload(cart),
        addressId,
        ...(offerCode ? { offerCode } : {}),
    }

    return (
        <div className="mx-auto max-w-(--container-page) px-4 pb-8 sm:px-6">
            <h1 className="pt-8 text-[1.6rem] font-extrabold tracking-tight sm:text-3xl">Checkout</h1>

            <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1fr)_23rem] lg:items-start">
                <div className="space-y-5">
                    <section>
                        <h2 className="mb-2.5 text-sm font-bold uppercase tracking-wide text-ink-400">
                            Delivery address
                        </h2>
                        <AddressPicker
                            addresses={addresses}
                            selectedId={addressId}
                            onSelect={setAddressId}
                            onAddressesChanged={setAddresses}
                        />
                    </section>

                    <section>
                        <h2 className="mb-2.5 text-sm font-bold uppercase tracking-wide text-ink-400">
                            Your order
                        </h2>

                        {error ? (
                            <div className="rounded-2xl border border-sand-200 bg-surface">
                                {staleCart ? (
                                    // The cart refers to items the kitchen no longer has (menu
                                    // changed, or a very old cart). Retrying can't fix that —
                                    // offer the thing that actually helps.
                                    <EmptyState
                                        title="Your cart is out of date"
                                        message="Some of these items aren't on the menu any more. Start again and we'll be quick about it."
                                        action={
                                            <Button as={Link} href="/restaurants" onClick={() => clearCart()}>
                                                Start a new order
                                            </Button>
                                        }
                                    />
                                ) : (
                                    <ErrorState
                                        title="We couldn't price your order"
                                        message={error.message}
                                        onRetry={retry}
                                    />
                                )}
                            </div>
                        ) : (
                            <div className="rounded-2xl border border-sand-200 bg-surface">
                                <div className="border-b border-sand-200 px-4 py-3.5">
                                    <p className="text-xs font-bold uppercase tracking-wide text-ink-400">
                                        Order from
                                    </p>
                                    <p className="mt-0.5 font-extrabold">
                                        {quote?.restaurant.name ?? cart.restaurantName}
                                    </p>
                                </div>

                                {loading && !quote ? (
                                    <div className="space-y-3 p-4">
                                        {Array.from({ length: 2 }).map((_, i) => (
                                            <div key={i} className="flex items-center gap-3">
                                                <div className="skeleton size-11 rounded-xl" />
                                                <div className="flex-1 space-y-2">
                                                    <div className="skeleton h-3.5 w-1/2 rounded" />
                                                    <div className="skeleton h-3 w-1/4 rounded" />
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <ul className="divide-y divide-sand-200 px-4">
                                        {(quote?.items ?? []).map((item) => (
                                            <li key={item.menuItemId} className="flex items-center gap-3 py-3.5">
                                                <LineImage name={item.name} />
                                                <div className="min-w-0 flex-1">
                                                    <div className="flex items-start gap-1.5">
                                                        <VegMark isVeg={item.isVeg} className="mt-0.5" />
                                                        <p className="line-clamp-1 text-[0.95rem] font-bold">
                                                            {item.name}
                                                        </p>
                                                    </div>
                                                    <p className="mt-0.5 text-sm text-ink-400">
                                                        {currency.format(item.unitPrice)} × {item.quantity}
                                                    </p>
                                                </div>
                                                <p className="shrink-0 text-sm font-bold tabular-nums">
                                                    {currency.format(item.lineTotal)}
                                                </p>
                                            </li>
                                        ))}
                                    </ul>
                                )}

                                <div className="px-4 pb-3.5 pt-1">
                                    <Link
                                        href="/cart"
                                        className="press inline-flex h-8 items-center rounded-lg px-2 text-sm font-bold text-paprika-600 hover:bg-paprika-50"
                                    >
                                        Edit cart
                                    </Link>
                                </div>
                            </div>
                        )}
                    </section>

                    <AnimatePresence>
                        {quote?.warnings?.length > 0 && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                className="overflow-hidden"
                            >
                                <div role="status" className="flex gap-3 rounded-2xl border border-gold-500/30 bg-gold-100/50 p-4">
                                    <AlertTriangle className="size-5 shrink-0 text-gold-700" strokeWidth={2.2} />
                                    <ul className="space-y-1 text-sm font-medium text-gold-700">
                                        {quote.warnings.map((w, i) => <li key={i}>{w.message}</li>)}
                                    </ul>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <section>
                        <h2 className="mb-2.5 text-sm font-bold uppercase tracking-wide text-ink-400">
                            Offers
                        </h2>
                        <OfferPicker
                            appliedOffer={quote?.appliedOffer}
                            availableOffers={quote?.availableOffers}
                            offerError={quote?.offerError}
                            onApply={setOfferCode}
                            onRemove={() => setOfferCode(null)}
                            busy={loading}
                        />
                    </section>
                </div>

                <aside className="lg:sticky lg:top-24">
                    {quote ? (
                        <BillDetails pricing={quote.pricing} />
                    ) : (
                        <div className="rounded-2xl border border-sand-200 bg-surface p-5">
                            <div className="skeleton h-5 w-28 rounded" />
                            <div className="mt-4 space-y-3">
                                {Array.from({ length: 4 }).map((_, i) => (
                                    <div key={i} className="skeleton h-3.5 w-full rounded" />
                                ))}
                            </div>
                        </div>
                    )}

                    <div className="mt-4 hidden lg:block">
                        <PayButton
                            quotePayload={payPayload}
                            total={quote?.pricing.total}
                            disabled={!canContinue}
                            needsAddress={needsAddress}
                        />
                    </div>
                </aside>
            </div>

            {/* Mobile: the CTA stays within reach at the bottom of the screen. */}
            <div className="safe-bottom fixed inset-x-0 bottom-[4.25rem] z-30 border-t border-sand-200 bg-paper/95 p-3 backdrop-blur-md lg:hidden">
                <PayButton
                    quotePayload={payPayload}
                    total={quote?.pricing.total}
                    disabled={!canContinue}
                    needsAddress={needsAddress}
                />
            </div>
        </div>
    )
}

/** Checkout line thumbnail; falls back to an initial tile when we have no photo. */
function LineImage({ name }) {
    const photo = dishImage(name)

    if (!photo.src) {
        return (
            <div className="grid size-11 shrink-0 place-items-center rounded-xl bg-sand-100 text-sm font-extrabold text-ink-400">
                {name.charAt(0).toUpperCase()}
            </div>
        )
    }

    return (
        <div className="relative size-11 shrink-0 overflow-hidden rounded-xl bg-sand-100">
            <SmartImage src={photo.src} alt={photo.alt} focus={photo.focus} sizes="66px" />
        </div>
    )
}
