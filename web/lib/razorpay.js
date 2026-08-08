'use client'

const SCRIPT_SRC = 'https://checkout.razorpay.com/v1/checkout.js'

let loader = null

/**
 * Loads the Razorpay Checkout script once.
 *
 * The promise is cached, so repeated payment attempts reuse the same script tag
 * instead of stacking up new ones. Resolves false when the script can't load —
 * offline, blocked, provider down — so the caller can say something human
 * rather than throwing.
 */
export const loadRazorpay = () => {
    if (typeof window === 'undefined') return Promise.resolve(false)
    if (window.Razorpay) return Promise.resolve(true)
    if (loader) return loader

    loader = new Promise((resolve) => {
        const existing = document.querySelector(`script[src="${SCRIPT_SRC}"]`)
        if (existing) {
            existing.addEventListener('load', () => resolve(true))
            existing.addEventListener('error', () => { loader = null; resolve(false) })
            return
        }

        const script = document.createElement('script')
        script.src = SCRIPT_SRC
        script.async = true
        script.onload = () => resolve(true)
        script.onerror = () => { loader = null; resolve(false) }
        document.body.appendChild(script)
    })

    return loader
}

/**
 * Opens Razorpay Checkout.
 *
 * Everything here comes from the server's create-payment response — the amount
 * is never assembled in the browser.
 *
 * Resolves with { status: 'paid' | 'dismissed' | 'failed' }. It never resolves
 * "paid" on its own authority: that only means Razorpay handed back a payload,
 * which the server still has to verify.
 */
export const openCheckout = ({ session, productName, onPaid, onDismissed, onFailed }) => {
    const options = {
        key: session.razorpayKeyId,
        order_id: session.razorpayOrderId,
        amount: session.amount,
        currency: session.currency,
        name: productName,
        description: `Order ${session.orderNumber}`,
        prefill: {
            name: session.prefill?.name || '',
            email: session.prefill?.email || '',
            contact: session.prefill?.contact || '',
        },
        notes: { orderNumber: session.orderNumber },
        theme: { color: '#ee4f24' },
        handler: (response) => onPaid(response),
        modal: {
            ondismiss: () => onDismissed(),
            escape: true,
        },
    }

    const checkout = new window.Razorpay(options)

    checkout.on('payment.failed', (response) => {
        onFailed(response?.error?.description || null)
    })

    checkout.open()
    return checkout
}
