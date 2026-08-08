'use client'

import { motion } from 'motion/react'
import { Check } from 'lucide-react'
import { cn } from '@/lib/cn'

/**
 * Order status, in the words a person would use.
 */
export const STATUS_COPY = {
    pending_payment: { title: 'Waiting for payment', short: 'Not paid' },
    confirmed: { title: "Your order's in", short: 'Confirmed' },
    preparing: { title: 'The restaurant is preparing your food', short: 'Preparing' },
    on_the_way: { title: 'Your order is on the way', short: 'On the way' },
    delivered: { title: 'Delivered', short: 'Delivered' },
    cancelled: { title: 'Cancelled', short: 'Cancelled' },
    payment_failed: { title: "Payment didn't go through", short: 'Payment failed' },
}

const STEPS = [
    { status: 'confirmed', label: 'Order confirmed' },
    { status: 'preparing', label: 'Preparing your food' },
    { status: 'on_the_way', label: 'On the way' },
    { status: 'delivered', label: 'Delivered' },
]

/**
 * Vertical progression. No map, no rider, no fake GPS — just where the order
 * has got to. The active step animates in when the status moves.
 */
export function OrderTracker({ status }) {
    const currentIndex = STEPS.findIndex((s) => s.status === status)

    if (currentIndex === -1) return null

    return (
        <ol className="relative">
            {STEPS.map((step, index) => {
                const done = index < currentIndex
                const active = index === currentIndex
                const isLast = index === STEPS.length - 1

                return (
                    <li key={step.status} className="relative flex gap-4 pb-6 last:pb-0">
                        {!isLast && (
                            <span
                                aria-hidden
                                className={cn(
                                    'absolute left-[0.6875rem] top-6 h-[calc(100%-1rem)] w-0.5 rounded-full transition-colors duration-500',
                                    done ? 'bg-veg' : 'bg-sand-200',
                                )}
                            />
                        )}

                        <span className="relative z-10 mt-0.5 shrink-0">
                            {done ? (
                                <span className="grid size-6 place-items-center rounded-full bg-veg text-white">
                                    <Check className="size-3.5" strokeWidth={3.5} />
                                </span>
                            ) : active ? (
                                <motion.span
                                    initial={{ scale: 0.6 }}
                                    animate={{ scale: 1 }}
                                    transition={{ type: 'spring', stiffness: 400, damping: 22 }}
                                    className="grid size-6 place-items-center rounded-full bg-paprika-500"
                                >
                                    <span className="size-2 rounded-full bg-white" />
                                </motion.span>
                            ) : (
                                <span className="grid size-6 place-items-center rounded-full border-2 border-sand-300 bg-surface" />
                            )}
                        </span>

                        <span className={cn(
                            'pt-0.5 text-[0.95rem] transition-colors',
                            active ? 'font-extrabold text-ink-900'
                                : done ? 'font-semibold text-ink-600' : 'text-ink-400',
                        )}>
                            {step.label}
                        </span>
                    </li>
                )
            })}
        </ol>
    )
}

export function StatusBadge({ status, className }) {
    const tone = status === 'delivered' ? 'bg-veg/10 text-veg'
        : status === 'cancelled' || status === 'payment_failed' ? 'bg-danger/10 text-danger'
            : 'bg-paprika-50 text-paprika-700'

    return (
        <span className={cn(
            'inline-flex items-center rounded-md px-2 py-0.5 text-xs font-bold uppercase tracking-wide',
            tone, className,
        )}>
            {STATUS_COPY[status]?.short ?? status}
        </span>
    )
}
