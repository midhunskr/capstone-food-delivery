'use client'

import { useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { BadgePercent, Check, Tag, X } from 'lucide-react'
import { Sheet } from '@/components/ui/Sheet'
import { Button } from '@/components/ui/Button'
import { currency } from '@/config/product'
import { cn } from '@/lib/cn'

/**
 * Offers at checkout.
 *
 * Eligibility is decided by the server — this only shows what it said and
 * relays the reason when something doesn't apply. Applying or removing an offer
 * re-requests the quote, so the bill and the offer can never disagree.
 */
export function OfferPicker({ appliedOffer, availableOffers = [], offerError, onApply, onRemove, busy }) {
    const [open, setOpen] = useState(false)
    const [code, setCode] = useState('')

    const apply = (value) => {
        setOpen(false)
        setCode('')
        onApply(value)
    }

    if (appliedOffer) {
        return (
            <motion.div
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
                className="flex items-center gap-3 rounded-2xl border border-veg/25 bg-veg/5 p-4"
            >
                <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-veg/10 text-veg">
                    <Check className="size-5" strokeWidth={3} />
                </span>
                <div className="min-w-0 flex-1">
                    <p className="font-extrabold text-veg">
                        {currency.format(appliedOffer.savings ?? 0)} saved
                    </p>
                    <p className="truncate text-sm text-ink-500">
                        {appliedOffer.code ? `${appliedOffer.code} · ` : ''}{appliedOffer.title}
                    </p>
                </div>
                <button
                    onClick={onRemove}
                    disabled={busy}
                    className="press grid size-8 shrink-0 place-items-center rounded-lg text-ink-500 hover:bg-sand-100 disabled:opacity-50"
                    aria-label="Remove offer"
                >
                    <X className="size-4" strokeWidth={2.6} />
                </button>
            </motion.div>
        )
    }

    return (
        <>
            <button
                onClick={() => setOpen(true)}
                disabled={busy}
                className="press flex w-full items-center gap-3 rounded-2xl border border-dashed border-sand-300 bg-surface p-4 text-left hover:border-paprika-300 hover:bg-paprika-50/40 disabled:opacity-60"
            >
                <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-paprika-50 text-paprika-600">
                    <Tag className="size-[1.05rem]" strokeWidth={2.2} />
                </span>
                <span className="min-w-0 flex-1">
                    <span className="block font-bold">Apply an offer</span>
                    <span className="block truncate text-sm text-ink-400">
                        {availableOffers.some((o) => o.eligible)
                            ? `${availableOffers.filter((o) => o.eligible).length} available for this order`
                            : 'Enter a code'}
                    </span>
                </span>
            </button>

            <AnimatePresence>
                {offerError && (
                    <motion.p
                        role="alert"
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="overflow-hidden text-sm font-medium text-danger"
                    >
                        <span className="block pt-2">{offerError}</span>
                    </motion.p>
                )}
            </AnimatePresence>

            <Sheet open={open} onClose={() => setOpen(false)} title="Offers">
                <form
                    onSubmit={(e) => { e.preventDefault(); if (code.trim()) apply(code.trim().toUpperCase()) }}
                    className="flex gap-2"
                >
                    <label htmlFor="offer-code" className="sr-only">Offer code</label>
                    <input
                        id="offer-code"
                        value={code}
                        onChange={(e) => setCode(e.target.value.toUpperCase())}
                        placeholder="Enter a code"
                        autoComplete="off"
                        className="h-12 flex-1 rounded-xl border border-sand-200 bg-surface px-4 font-semibold tracking-wide outline-none transition-colors focus:border-paprika-400"
                    />
                    <Button type="submit" disabled={!code.trim()}>Apply</Button>
                </form>

                {availableOffers.length > 0 && (
                    <ul className="mt-5 space-y-2.5">
                        {availableOffers.map((offer) => (
                            <li key={offer.id}>
                                <div className={cn(
                                    'rounded-2xl border p-4',
                                    offer.eligible ? 'border-sand-200 bg-surface' : 'border-sand-200 bg-sand-50',
                                )}>
                                    <div className="flex items-start gap-3">
                                        <span className={cn(
                                            'grid size-9 shrink-0 place-items-center rounded-xl',
                                            offer.eligible ? 'bg-paprika-50 text-paprika-600' : 'bg-sand-100 text-ink-400',
                                        )}>
                                            <BadgePercent className="size-[1.05rem]" strokeWidth={2.2} />
                                        </span>

                                        <div className="min-w-0 flex-1">
                                            <p className={cn('font-extrabold', !offer.eligible && 'text-ink-500')}>
                                                {offer.title}
                                            </p>
                                            {offer.description && (
                                                <p className="mt-0.5 text-sm text-ink-400">{offer.description}</p>
                                            )}
                                            {offer.eligible ? (
                                                offer.savings > 0 && (
                                                    <p className="mt-1 text-sm font-bold text-veg">
                                                        Saves {currency.format(offer.savings)}
                                                    </p>
                                                )
                                            ) : (
                                                <p className="mt-1 text-sm text-ink-400">{offer.reason}</p>
                                            )}
                                        </div>

                                        {offer.eligible && (
                                            <Button
                                                size="sm"
                                                variant="secondary"
                                                onClick={() => apply(offer.code ?? undefined)}
                                                disabled={!offer.code}
                                                title={offer.code ? undefined : 'Applied automatically'}
                                            >
                                                {offer.code ? 'Apply' : 'Auto'}
                                            </Button>
                                        )}
                                    </div>
                                </div>
                            </li>
                        ))}
                    </ul>
                )}
            </Sheet>
        </>
    )
}
