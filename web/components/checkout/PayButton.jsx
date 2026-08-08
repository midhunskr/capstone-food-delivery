'use client'

import { useRouter } from 'next/navigation'
import { useRef, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { AlertTriangle } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { currency, product } from '@/config/product'
import { clearCart } from '@/lib/cart'
import { createPayment, reportPaymentFailure, verifyPayment } from '@/lib/client'
import { loadRazorpay, openCheckout } from '@/lib/razorpay'

/**
 * The payment step.
 *
 * Rules that are not negotiable here:
 *  - the amount comes from the server's create-payment response, never from
 *    anything on this screen
 *  - the cart is cleared ONLY after the server verifies the signature and
 *    confirms the order — not when Razorpay opens, not in the handler
 *  - a dismissed or failed payment leaves cart, address and offer exactly as
 *    they were
 */
export function PayButton({ quotePayload, total, disabled, needsAddress }) {
    const router = useRouter()
    const [phase, setPhase] = useState('idle')   // idle | starting | open | verifying
    const [error, setError] = useState(null)
    const inFlight = useRef(false)

    const busy = phase !== 'idle'

    const start = async () => {
        // A second press must never create a second payment.
        if (inFlight.current) return
        inFlight.current = true
        setError(null)
        setPhase('starting')

        const scriptReady = await loadRazorpay()
        if (!scriptReady) {
            setError("We couldn't reach the payment provider. Check your connection and try again.")
            setPhase('idle')
            inFlight.current = false
            return
        }

        const created = await createPayment(quotePayload)
        if (!created.ok) {
            setError(created.error?.message || "We couldn't start the payment. Please try again.")
            setPhase('idle')
            inFlight.current = false
            return
        }

        const session = created.data
        setPhase('open')

        openCheckout({
            session,
            productName: product.name,

            onPaid: async (response) => {
                setPhase('verifying')

                const verified = await verifyPayment({
                    razorpayOrderId: response.razorpay_order_id,
                    razorpayPaymentId: response.razorpay_payment_id,
                    signature: response.razorpay_signature,
                })

                if (!verified.ok) {
                    // Payment may well have been taken, but we could not confirm
                    // it. Keep the cart; say so plainly.
                    setError(verified.error?.message
                        || "We couldn't confirm that payment. Your cart hasn't been cleared.")
                    setPhase('idle')
                    inFlight.current = false
                    return
                }

                // Confirmed by the server. Only now is it safe to empty the cart.
                clearCart()

                // Tell the order page this arrival is a fresh purchase, so it can
                // show the confirmation. sessionStorage rather than a query param:
                // it survives the redirect, is read exactly once, and never
                // replays if the page is refreshed or the link is shared.
                try {
                    sessionStorage.setItem('moro.justPlaced', verified.data.order.orderNumber)
                } catch { /* private mode — the order page still works */ }

                router.replace(`/orders/${verified.data.order.orderNumber}`)
            },

            onDismissed: async () => {
                await reportPaymentFailure({ razorpayOrderId: session.razorpayOrderId, reason: 'dismissed' })
                setError("Payment wasn't completed. Your cart is still here.")
                setPhase('idle')
                inFlight.current = false
            },

            onFailed: async (reason) => {
                await reportPaymentFailure({ razorpayOrderId: session.razorpayOrderId, reason: reason || 'failed' })
                setError("That payment didn't go through. Nothing's been charged.")
                setPhase('idle')
                inFlight.current = false
            },
        })
    }

    const label = needsAddress ? 'Choose a delivery address'
        : phase === 'starting' ? 'Opening payment'
            : phase === 'verifying' ? 'Confirming your order'
                : phase === 'open' ? 'Waiting for payment'
                    : null

    return (
        <div>
            <AnimatePresence>
                {error && (
                    <motion.div
                        role="alert"
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="overflow-hidden"
                    >
                        <div className="mb-3 flex gap-2.5 rounded-xl border border-danger/25 bg-danger/5 p-3">
                            <AlertTriangle className="size-4.5 shrink-0 text-danger" strokeWidth={2.2} />
                            <p className="text-sm font-medium text-danger">{error}</p>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <Button
                size="lg"
                className="w-full"
                onClick={start}
                disabled={disabled || busy}
                loading={busy}
            >
                {label ?? (
                    <span className="flex w-full items-center justify-between">
                        <span>Continue to payment</span>
                        <span className="tabular-nums">{currency.format(total ?? 0)}</span>
                    </span>
                )}
            </Button>
        </div>
    )
}
