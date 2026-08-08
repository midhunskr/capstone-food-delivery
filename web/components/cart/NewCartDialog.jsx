'use client'

import { Sheet } from '@/components/ui/Sheet'
import { Button } from '@/components/ui/Button'

/**
 * Cross-restaurant confirmation.
 *
 * The cart holds one restaurant at a time. Rather than silently clearing
 * someone's food, we name the restaurant they'd lose and make "keep" the easy,
 * default-looking choice.
 */
export function NewCartDialog({ open, onClose, onConfirm, currentRestaurantName }) {
    return (
        <Sheet
            open={open}
            onClose={onClose}
            title="Start a new cart?"
            footer={
                <div className="flex flex-col-reverse gap-2.5 sm:flex-row">
                    <Button variant="secondary" className="flex-1" onClick={onClose}>
                        Keep current cart
                    </Button>
                    <Button className="flex-1" onClick={onConfirm}>
                        Start new cart
                    </Button>
                </div>
            }
        >
            <p className="py-1 text-[0.98rem] leading-relaxed text-ink-600">
                Your cart has items from{' '}
                <span className="font-bold text-ink-900">{currentRestaurantName || 'another restaurant'}</span>.
                Starting a new order will clear them.
            </p>
        </Sheet>
    )
}
