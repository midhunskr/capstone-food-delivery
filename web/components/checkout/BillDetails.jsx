'use client'

import { motion } from 'motion/react'
import { currency } from '@/config/product'
import { cn } from '@/lib/cn'

/**
 * The bill. Every number here comes from the server quote — nothing is computed
 * in the browser. Charges are all shown; nothing is folded into another line.
 */
export function BillDetails({ pricing, className }) {
    const { subtotal, discount, deliveryFee, tax, total } = pricing

    return (
        <div className={cn('rounded-2xl border border-sand-200 bg-surface p-5', className)}>
            <h2 className="text-base font-extrabold">Bill details</h2>

            <dl className="mt-4 space-y-2.5 text-[0.95rem]">
                <Row label="Item total" value={currency.format(subtotal)} />

                {discount > 0 && (
                    <Row
                        label="Discount"
                        value={`-${currency.format(discount)}`}
                        tone="text-veg font-bold"
                    />
                )}

                <Row
                    label="Delivery fee"
                    value={deliveryFee === 0 ? 'Free' : currency.format(deliveryFee)}
                    tone={deliveryFee === 0 ? 'text-veg font-bold' : undefined}
                />

                <Row label="Taxes" value={currency.format(tax)} />
            </dl>

            <div className="mt-4 border-t border-dashed border-sand-200 pt-4">
                <div className="flex items-baseline justify-between">
                    <span className="text-base font-extrabold">To pay</span>
                    <motion.span
                        key={total}
                        initial={{ opacity: 0, y: -6 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
                        className="text-xl font-extrabold tabular-nums"
                    >
                        {currency.format(total)}
                    </motion.span>
                </div>
            </div>
        </div>
    )
}

function Row({ label, value, tone }) {
    return (
        <div className="flex justify-between gap-4">
            <dt className="text-ink-500">{label}</dt>
            <dd className={cn('tabular-nums', tone ?? 'font-semibold')}>{value}</dd>
        </div>
    )
}
