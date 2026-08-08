import crypto from 'node:crypto'
import Razorpay from 'razorpay'
import { env } from '../config/env.js'

/**
 * Razorpay boundary. One instance, one place that knows the secret.
 *
 * The secret never leaves this module and is never logged. Only the key id is
 * ever handed to the browser — the checkout SDK needs it and it is public by
 * design.
 */

let client = null
let injectedClient = null

const getClient = () => {
    if (injectedClient) return injectedClient
    if (!env.razorpay.configured) return null
    if (!client) {
        client = new Razorpay({ key_id: env.razorpay.keyId, key_secret: env.razorpay.keySecret })
    }
    return client
}

/**
 * Test seam. Lets the suite stand in for Razorpay's HTTP calls so no test ever
 * touches the real API or creates a real charge.
 *
 * Signature verification is deliberately NOT injectable — that is the security
 * boundary and the tests must exercise the real cryptography.
 */
export const __setRazorpayClient = (stub) => { injectedClient = stub }

export const isConfigured = () => env.razorpay.configured

/**
 * Creates a Razorpay order for an amount the SERVER decided.
 * `amountRupees` must come from the pricing service, never from a request body.
 */
export const createRazorpayOrder = async ({ amountRupees, receipt, notes }) => {
    const razorpay = getClient()
    if (!razorpay) throw new Error('Razorpay is not configured')

    return razorpay.orders.create({
        amount: Math.round(amountRupees * 100), // paise
        currency: 'INR',
        receipt,
        notes,
    })
}

/**
 * Verifies the checkout signature.
 *
 * Razorpay signs `order_id|payment_id` with the key secret. Comparison is
 * timing-safe. A mismatch means the callback did not come from Razorpay and the
 * order must not be marked paid.
 */
export const verifyPaymentSignature = ({ razorpayOrderId, razorpayPaymentId, signature }) => {
    if (!env.razorpay.keySecret || !signature) return false

    const expected = crypto
        .createHmac('sha256', env.razorpay.keySecret)
        .update(`${razorpayOrderId}|${razorpayPaymentId}`)
        .digest('hex')

    const a = Buffer.from(expected, 'utf8')
    const b = Buffer.from(String(signature), 'utf8')

    // timingSafeEqual throws on length mismatch, which is itself a failure.
    if (a.length !== b.length) return false
    return crypto.timingSafeEqual(a, b)
}

/** Payment details from Razorpay, used to record the method. Never fatal. */
export const fetchPayment = async (razorpayPaymentId) => {
    const razorpay = getClient()
    if (!razorpay) return null
    try {
        return await razorpay.payments.fetch(razorpayPaymentId)
    } catch {
        return null
    }
}
