import { User } from '../../models/userModel.js'
import { Order } from '../../models/v2/order.js'
import { asyncHandler } from '../../utils/asyncHandler.js'
import { sendSuccess } from '../../utils/apiResponse.js'
import { ApiError } from '../../utils/apiError.js'
import { buildQuote } from '../../services/pricing.js'
import { createRazorpayOrder, fetchPayment, isConfigured, verifyPaymentSignature } from '../../services/razorpay.js'
import { createWithOrderNumber } from '../../services/orderNumber.js'
import { env } from '../../config/env.js'
import { orderDetail } from '../../utils/dto.js'

/**
 * POST /api/v2/payments/create
 *
 * Rebuilds the price from the database, creates a pending order, then creates a
 * Razorpay order for that server-decided amount.
 *
 * The pending order is written BEFORE payment on purpose: it gives verification
 * something to attach to, so a payment can never succeed with no order record
 * to reconcile against.
 *
 * Nothing about money is read from the request — only which items, which
 * address, which offer code.
 */
export const createPayment = asyncHandler(async (req, res) => {
    if (!isConfigured()) {
        throw new ApiError(503, 'PAYMENTS_UNAVAILABLE',
            "We can't take payments right now. Please try again shortly.")
    }

    const { restaurantId, items, offerCode, addressId } = req.body

    // Authoritative re-pricing. Same service checkout used, run again at the
    // moment of payment so a stale screen can't set the amount.
    const quote = await buildQuote({ restaurantId, items, offerCode })

    const user = await User.findById(req.user.id).select('addresses name email phone')
    if (!user) throw ApiError.unauthorized('ACCOUNT_NOT_FOUND', 'Please sign in again.')

    const address = user.addresses.id(addressId)
    if (!address) {
        throw ApiError.notFound('ADDRESS_NOT_FOUND',
            "We couldn't find that address. Pick another one.")
    }

    // Snapshot everything now — later edits to menu, restaurant or address must
    // never rewrite what was bought.
    const order = await createWithOrderNumber(Order, {
        user: user._id,
        restaurant: {
            id: quote.restaurant.id,
            name: quote.restaurant.name,
            slug: quote.restaurant.slug,
            area: quote.restaurant.area,
            image: quote.restaurant.image,
            deliveryTimeMinutes: quote.restaurant.deliveryTimeMinutes,
        },
        items: quote.items.map((item) => ({
            menuItemId: item.menuItemId,
            name: item.name,
            image: item.image,
            isVeg: item.isVeg,
            unitPrice: item.unitPrice,
            quantity: item.quantity,
            lineTotal: item.lineTotal,
        })),
        deliveryAddress: {
            label: address.label,
            customLabel: address.customLabel,
            recipientName: address.recipientName,
            phone: address.phone,
            addressLine1: address.addressLine1,
            addressLine2: address.addressLine2,
            area: address.area,
            city: address.city,
            state: address.state,
            postalCode: address.postalCode,
            landmark: address.landmark,
        },
        pricing: quote.pricing,
        offer: quote.appliedOffer
            ? {
                code: quote.appliedOffer.code,
                title: quote.appliedOffer.title,
                savings: quote.appliedOffer.savings,
            }
            : undefined,
        estimatedMinutes: {
            min: quote.restaurant.deliveryTimeMinutes,
            max: quote.restaurant.deliveryTimeMinutes + 7,
        },
        status: 'pending_payment',
        statusHistory: [{ status: 'pending_payment', at: new Date() }],
    })

    let razorpayOrder
    try {
        razorpayOrder = await createRazorpayOrder({
            amountRupees: quote.pricing.total,
            receipt: order.orderNumber,
            notes: { orderNumber: order.orderNumber, userId: String(user._id) },
        })
    } catch (error) {
        // Never surface the provider's error text to the customer.
        console.error('[payments/create] Razorpay order creation failed:', error?.message)
        order.status = 'payment_failed'
        order.payment.failureReason = 'provider_unavailable'
        await order.save()
        throw new ApiError(502, 'PAYMENT_PROVIDER_ERROR',
            "We couldn't start the payment. Please try again.")
    }

    order.payment.razorpayOrderId = razorpayOrder.id
    await order.save()

    return sendSuccess(res, {
        orderNumber: order.orderNumber,
        razorpayOrderId: razorpayOrder.id,
        // Public key — the checkout SDK requires it in the browser.
        razorpayKeyId: env.razorpay.keyId,
        amount: razorpayOrder.amount,       // paise, as Razorpay expects
        currency: razorpayOrder.currency,
        pricing: quote.pricing,
        prefill: {
            name: user.name ?? '',
            email: user.email ?? '',
            contact: address.phone ?? user.phone ?? '',
        },
    }, { status: 201 })
})

/**
 * POST /api/v2/payments/verify
 *
 * The security boundary. An order becomes paid here and nowhere else.
 *
 * Idempotent: replaying the same Razorpay payment returns the same order rather
 * than creating or confirming anything twice.
 */
export const verifyPayment = asyncHandler(async (req, res) => {
    const { razorpayOrderId, razorpayPaymentId, signature } = req.body

    const order = await Order.findOne({ 'payment.razorpayOrderId': razorpayOrderId })

    // Do not reveal whether the id exists but belongs to someone else.
    if (!order || String(order.user) !== String(req.user.id)) {
        throw ApiError.notFound('ORDER_NOT_FOUND', "We couldn't find that order.")
    }

    // Already verified — a retry, a double-click, or a recovered network call.
    if (order.payment.status === 'paid') {
        return sendSuccess(res, { order: orderDetail(order), alreadyConfirmed: true })
    }

    const valid = verifyPaymentSignature({ razorpayOrderId, razorpayPaymentId, signature })

    if (!valid) {
        // Safe diagnostics only: ids, never the signature or the secret.
        console.error('[payments/verify] signature mismatch', {
            orderNumber: order.orderNumber,
            razorpayOrderId,
            razorpayPaymentId,
        })
        order.payment.attempts.push({ at: new Date(), reason: 'signature_mismatch' })
        await order.save()

        throw ApiError.badRequest('PAYMENT_VERIFICATION_FAILED',
            "We couldn't confirm that payment. Your cart hasn't been cleared.")
    }

    order.payment.status = 'paid'
    order.payment.razorpayPaymentId = razorpayPaymentId
    order.payment.paidAt = new Date()
    order.status = 'confirmed'
    order.confirmedAt = new Date()
    order.statusHistory.push({ status: 'confirmed', at: new Date() })

    try {
        await order.save()
    } catch (error) {
        // The unique index on razorpayPaymentId rejected it: this payment is
        // already recorded against an order. Treat as the success it is.
        if (error?.code === 11000) {
            const existing = await Order.findOne({ 'payment.razorpayPaymentId': razorpayPaymentId })
            if (existing && String(existing.user) === String(req.user.id)) {
                return sendSuccess(res, { order: orderDetail(existing), alreadyConfirmed: true })
            }
        }
        throw error
    }

    // Best-effort enrichment; failure here must not undo a confirmed order.
    const payment = await fetchPayment(razorpayPaymentId)
    if (payment?.method) {
        order.payment.method = payment.method
        await order.save().catch(() => {})
    }

    return sendSuccess(res, { order: orderDetail(order), alreadyConfirmed: false })
})

/**
 * POST /api/v2/payments/failed
 *
 * The customer dismissed the sheet or the payment failed. Records the attempt;
 * the order stays unpaid and the cart is left alone.
 */
export const recordPaymentFailure = asyncHandler(async (req, res) => {
    const { razorpayOrderId, reason } = req.body

    const order = await Order.findOne({ 'payment.razorpayOrderId': razorpayOrderId })
    if (!order || String(order.user) !== String(req.user.id)) {
        throw ApiError.notFound('ORDER_NOT_FOUND', "We couldn't find that order.")
    }

    if (order.payment.status !== 'paid') {
        order.payment.attempts.push({ at: new Date(), reason: String(reason || 'dismissed').slice(0, 120) })
        await order.save()
    }

    return sendSuccess(res, { orderNumber: order.orderNumber, retryable: true })
})
