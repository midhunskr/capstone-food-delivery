'use client'

import { useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { Minus, Plus } from 'lucide-react'
import {
    addItem, decrementItem, incrementItem, replaceCartWith, useCart, useItemQuantity,
} from '@/lib/cart'
import { NewCartDialog } from '@/components/cart/NewCartDialog'
import { cn } from '@/lib/cn'

/**
 * Add → quantity stepper, backed by the real cart.
 *
 * The button becomes the stepper in place rather than swapping to a different
 * control, which is what makes the interaction feel like one object responding
 * rather than two widgets trading places.
 */
export function AddControl({ dish, restaurant, disabled, size = 'md' }) {
    const cart = useCart()
    const quantity = useItemQuantity(dish.id)
    const [conflict, setConflict] = useState(false)

    const dims = size === 'sm' ? 'h-9 min-w-[6.25rem] text-sm' : 'h-10 min-w-[7rem] text-[0.95rem]'

    const handleAdd = () => {
        if (addItem(dish, restaurant) === 'conflict') setConflict(true)
    }

    const startNewCart = () => {
        replaceCartWith(dish, restaurant)
        setConflict(false)
    }

    if (disabled) {
        return (
            <div className={cn(
                'grid place-items-center rounded-xl border border-sand-200 bg-sand-100 font-bold text-ink-400',
                dims,
            )}>
                Sold out
            </div>
        )
    }

    return (
        <>
            <div className={cn('relative', dims)}>
                <AnimatePresence initial={false} mode="wait">
                    {quantity === 0 ? (
                        <motion.button
                            key="add"
                            type="button"
                            onClick={handleAdd}
                            aria-label={`Add ${dish.name}`}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            transition={{ duration: 0.15, ease: [0.22, 1, 0.36, 1] }}
                            whileTap={{ scale: 0.94 }}
                            className={cn(
                                'absolute inset-0 rounded-xl border-2 border-paprika-200 bg-white font-extrabold uppercase tracking-wide',
                                'text-paprika-600 shadow-card transition-colors hover:border-paprika-300 hover:bg-paprika-50',
                            )}
                        >
                            Add
                        </motion.button>
                    ) : (
                        <motion.div
                            key="stepper"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            transition={{ duration: 0.15, ease: [0.22, 1, 0.36, 1] }}
                            className="absolute inset-0 flex items-center justify-between rounded-xl bg-paprika-500 px-1 shadow-card"
                        >
                            <StepButton
                                onClick={() => decrementItem(dish.id)}
                                label={quantity === 1 ? `Remove ${dish.name}` : `Decrease ${dish.name}`}
                            >
                                <Minus className="size-4" strokeWidth={3} />
                            </StepButton>

                            <span
                                aria-live="polite"
                                aria-label={`Quantity ${quantity}`}
                                className="min-w-6 overflow-hidden text-center font-extrabold tabular-nums text-white"
                            >
                                <motion.span
                                    key={quantity}
                                    initial={{ y: -10, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    transition={{ duration: 0.16, ease: [0.22, 1, 0.36, 1] }}
                                    className="inline-block"
                                >
                                    {quantity}
                                </motion.span>
                            </span>

                            <StepButton onClick={() => incrementItem(dish.id)} label={`Increase ${dish.name}`}>
                                <Plus className="size-4" strokeWidth={3} />
                            </StepButton>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            <NewCartDialog
                open={conflict}
                onClose={() => setConflict(false)}
                onConfirm={startNewCart}
                currentRestaurantName={cart.restaurantName}
            />
        </>
    )
}

function StepButton({ onClick, label, children }) {
    return (
        <motion.button
            type="button"
            onClick={onClick}
            aria-label={label}
            whileTap={{ scale: 0.85 }}
            transition={{ duration: 0.12 }}
            className="grid size-8 place-items-center rounded-lg text-white hover:bg-white/15"
        >
            {children}
        </motion.button>
    )
}
