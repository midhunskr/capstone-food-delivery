'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { RotateCcw } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Sheet } from '@/components/ui/Sheet'
import { reorder as fetchReorder } from '@/lib/client'
import { addItem, clearCart, isSameRestaurant, useCart } from '@/lib/cart'

/**
 * Reorder.
 *
 * The server says what's still available; unavailable dishes are named, never
 * silently swapped. If the cart belongs to another restaurant this reuses the
 * existing "start a new cart?" confirmation rather than inventing a second
 * pattern for the same decision.
 */
export function ReorderButton({ orderNumber, variant = 'primary', className }) {
    const router = useRouter()
    const cart = useCart()
    const [busy, setBusy] = useState(false)
    const [pending, setPending] = useState(null)   // { payload, unavailable }
    const [error, setError] = useState(null)

    const applyToCart = (payload) => {
        const restaurant = {
            id: payload.restaurantId,
            slug: payload.restaurantSlug,
            name: payload.restaurantName,
        }

        clearCart()
        for (const item of payload.items) {
            const dish = {
                id: item.menuItemId,
                name: item.name,
                price: item.price,
                image: item.image,
                isVeg: item.isVeg,
            }
            // First add creates the line; the rest build the quantity up.
            for (let i = 0; i < item.quantity; i++) addItem(dish, restaurant)
        }
        router.push('/cart')
    }

    const start = async () => {
        setBusy(true)
        setError(null)

        const result = await fetchReorder(orderNumber)
        setBusy(false)

        if (!result.ok) {
            setError(result.error?.message || "We couldn't set that order up again. Try again.")
            return
        }

        const payload = result.data
        const conflicts = !isSameRestaurant(cart, payload.restaurantId)

        // Anything worth telling them about gets a confirmation step.
        if (conflicts || payload.unavailable.length > 0) {
            setPending({ payload, conflicts })
            return
        }

        applyToCart(payload)
    }

    return (
        <>
            <Button
                variant={variant}
                className={className ?? 'w-full'}
                onClick={start}
                loading={busy}
                disabled={busy}
            >
                <RotateCcw className="size-4" strokeWidth={2.4} /> Order again
            </Button>

            {error && <p role="alert" className="mt-2 text-sm font-medium text-danger">{error}</p>}

            <Sheet
                open={pending !== null}
                onClose={() => setPending(null)}
                title={pending?.conflicts ? 'Start a new cart?' : 'Some items are unavailable'}
                footer={
                    <div className="flex flex-col-reverse gap-2.5 sm:flex-row">
                        <Button variant="secondary" className="flex-1" onClick={() => setPending(null)}>
                            Cancel
                        </Button>
                        <Button
                            className="flex-1"
                            onClick={() => { applyToCart(pending.payload); setPending(null) }}
                        >
                            {pending?.conflicts ? 'Start new cart' : 'Add what’s available'}
                        </Button>
                    </div>
                }
            >
                <div className="space-y-3 py-1 text-[0.98rem] leading-relaxed text-ink-600">
                    {pending?.conflicts && (
                        <p>
                            Your cart has items from{' '}
                            <span className="font-bold text-ink-900">{cart.restaurantName}</span>.
                            Reordering will clear them.
                        </p>
                    )}
                    {pending?.payload.unavailable.length > 0 && (
                        <div>
                            <p>These aren&apos;t available right now, so we&apos;ll leave them out:</p>
                            <ul className="mt-1.5 list-inside list-disc font-semibold text-ink-900">
                                {pending.payload.unavailable.map((name) => <li key={name}>{name}</li>)}
                            </ul>
                        </div>
                    )}
                </div>
            </Sheet>
        </>
    )
}
