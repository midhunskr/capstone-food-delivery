import mongoose from 'mongoose'

/**
 * v2 Order.
 *
 * Everything customer-visible is a SNAPSHOT taken at purchase time. Menu prices
 * change, restaurants get renamed, addresses get deleted — none of that may
 * rewrite what someone already bought.
 *
 * Payment lives on the order rather than in a separate collection: there is
 * exactly one payment per order here, and splitting it would buy nothing but a
 * join and a chance for the two to disagree.
 *
 * Money is whole rupees, matching the pricing service.
 */

const itemSnapshotSchema = new mongoose.Schema({
    menuItemId: { type: mongoose.Schema.Types.ObjectId, required: true },
    name: { type: String, required: true },
    image: { type: String },
    isVeg: { type: Boolean },
    unitPrice: { type: Number, required: true },
    quantity: { type: Number, required: true },
    lineTotal: { type: Number, required: true },
}, { _id: false })

const orderSchema = new mongoose.Schema({
    orderNumber: { type: String, required: true, unique: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },

    restaurant: {
        id: { type: mongoose.Schema.Types.ObjectId, required: true },
        name: { type: String, required: true },
        slug: { type: String, required: true },
        area: { type: String },
        image: { type: String },
        deliveryTimeMinutes: { type: Number },
    },

    items: { type: [itemSnapshotSchema], required: true },

    deliveryAddress: {
        label: String,
        customLabel: String,
        recipientName: String,
        phone: String,
        addressLine1: String,
        addressLine2: String,
        area: String,
        city: String,
        state: String,
        postalCode: String,
        landmark: String,
    },

    pricing: {
        subtotal: { type: Number, required: true },
        discount: { type: Number, default: 0 },
        deliveryFee: { type: Number, default: 0 },
        tax: { type: Number, default: 0 },
        taxPercent: { type: Number },
        total: { type: Number, required: true },
    },

    offer: {
        code: String,
        title: String,
        savings: Number,
    },

    status: {
        type: String,
        enum: ['pending_payment', 'confirmed', 'preparing', 'on_the_way', 'delivered', 'cancelled', 'payment_failed'],
        default: 'pending_payment',
        index: true,
    },
    statusHistory: [{
        status: String,
        at: { type: Date, default: Date.now },
        _id: false,
    }],

    payment: {
        status: {
            type: String,
            enum: ['pending', 'paid', 'failed'],
            default: 'pending',
        },
        provider: { type: String, default: 'razorpay' },
        razorpayOrderId: { type: String, index: true },
        // Unique + sparse is the idempotency guard: the same Razorpay payment
        // can never be recorded against two orders, however many times a
        // verification request is retried.
        razorpayPaymentId: { type: String },
        method: { type: String },
        failureReason: { type: String },
        paidAt: { type: Date },
        attempts: [{ at: { type: Date, default: Date.now }, reason: String, _id: false }],
    },

    confirmedAt: { type: Date },
    estimatedMinutes: { min: Number, max: Number },
    deliveredAt: { type: Date },
    cancelledAt: { type: Date },
}, { timestamps: true, collection: 'v2orders' })

orderSchema.index({ user: 1, createdAt: -1 })
orderSchema.index({ 'payment.razorpayPaymentId': 1 }, { unique: true, sparse: true })

export const Order = mongoose.model('V2Order', orderSchema)
