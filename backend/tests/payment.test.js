import { after, before, describe, it } from 'node:test'
import assert from 'node:assert/strict'
import crypto from 'node:crypto'
import { api, startTestServer, stopTestServer } from './helpers.js'
import { seedDatabase } from '../seed/index.js'

/**
 * Payment and order tests.
 *
 * Razorpay's network calls are stubbed — no real charge is ever made — but the
 * signature verification under test is the real cryptographic code path, signed
 * with the same secret the server is configured with.
 */

let token, otherToken, restaurant, menu, defaultAddressId
let Order, razorpayService

const address = {
    label: 'home', recipientName: 'Test Person', phone: '9847012345',
    addressLine1: 'Flat 4B, Palm Grove', area: 'Panampilly Nagar',
    city: 'Kochi', state: 'Kerala', postalCode: '682036',
}

const TEST_SECRET = 'test-razorpay-secret'

/** Signs like Razorpay does: HMAC-SHA256 of "order_id|payment_id". */
const sign = (orderId, paymentId) =>
    crypto.createHmac('sha256', TEST_SECRET).update(`${orderId}|${paymentId}`).digest('hex')

let fakeOrderCounter = 0

before(async () => {
    process.env.RAZORPAY_KEY_ID = 'rzp_test_fake'
    process.env.RAZORPAY_KEY_SECRET = TEST_SECRET
    process.env.DEMO_ORDER_ACCELERATION = 'true'
    process.env.DEMO_ORDER_WINDOW_MINUTES = '3'

    await startTestServer()
    await seedDatabase()

    // Stand in for Razorpay's HTTP API. No real charge is ever created.
    // Signature verification is untouched and runs the real cryptography.
    razorpayService = await import('../services/razorpay.js')
    razorpayService.__setRazorpayClient({
        orders: {
            create: async ({ amount, currency, receipt }) => ({
                id: `order_TEST${++fakeOrderCounter}`, amount, currency, receipt,
            }),
        },
        payments: { fetch: async () => ({ method: 'upi' }) },
    })

    ;({ Order } = await import('../models/v2/order.js'))

    const register = async (email) => {
        const res = await api('/api/v2/auth/register', {
            method: 'POST', body: { name: 'Test Person', email, password: 'goodpassword1' },
        })
        return res.body.data.token
    }
    token = await register('pay@example.com')
    otherToken = await register('pay-other@example.com')

    restaurant = (await api('/api/v2/restaurants/dum-street')).body.data
    menu = (await api('/api/v2/restaurants/dum-street/menu')).body.data

    // One shared address: an account is capped at 10, and every payment here
    // would otherwise mint another one.
    defaultAddressId = (await addAddress()).id
})

after(async () => {
    razorpayService.__setRazorpayClient(null)
    await stopTestServer()
})

const dish = (name) => menu.sections.flatMap((s) => s.items).find((i) => i.name === name)

const addAddress = async (t = token) =>
    (await api('/api/v2/addresses', { method: 'POST', body: address, token: t })).body.data

const startPayment = async ({ t = token, addressId, items, offerCode } = {}) => {
    const id = addressId ?? (t === token ? defaultAddressId : (await addAddress(t)).id)
    return api('/api/v2/payments/create', {
        method: 'POST', token: t,
        body: {
            restaurantId: restaurant.id,
            items: items ?? [{ menuItemId: dish('Mutton Dum Biryani').id, quantity: 2 }],
            addressId: id,
            ...(offerCode ? { offerCode } : {}),
        },
    })
}

/** Runs a complete successful payment and returns the confirmed order. */
const payFully = async (options = {}) => {
    const created = await startPayment(options)
    const { razorpayOrderId, orderNumber } = created.body.data
    const paymentId = `pay_TEST${Math.random().toString(36).slice(2, 10)}`

    const verified = await api('/api/v2/payments/verify', {
        method: 'POST', token: options.t ?? token,
        body: { razorpayOrderId, razorpayPaymentId: paymentId, signature: sign(razorpayOrderId, paymentId) },
    })
    return { created, verified, orderNumber, razorpayOrderId, paymentId }
}

describe('payments/create', () => {
    it('requires authentication', async () => {
        const res = await api('/api/v2/payments/create', {
            method: 'POST',
            body: { restaurantId: restaurant.id, items: [{ menuItemId: dish('Chicken 65').id, quantity: 1 }], addressId: '507f1f77bcf86cd799439011' },
        })
        assert.equal(res.status, 401)
    })

    it('requires a delivery address', async () => {
        const res = await api('/api/v2/payments/create', {
            method: 'POST', token,
            body: { restaurantId: restaurant.id, items: [{ menuItemId: dish('Chicken 65').id, quantity: 1 }] },
        })
        assert.equal(res.status, 400)
        assert.equal(res.body.error.code, 'VALIDATION_FAILED')
    })

    it("rejects another user's address", async () => {
        const theirs = await addAddress(otherToken)
        const res = await startPayment({ addressId: theirs.id })
        assert.equal(res.status, 404)
        assert.equal(res.body.error.code, 'ADDRESS_NOT_FOUND')
    })

    it('charges the authoritative amount, ignoring anything the client sends', async () => {
        const item = dish('Mutton Dum Biryani')
        const created = await api('/api/v2/payments/create', {
            method: 'POST', token,
            body: {
                restaurantId: restaurant.id,
                items: [{ menuItemId: item.menuItemId ?? item.id, quantity: 2, price: 1, lineTotal: 1 }],
                addressId: (await addAddress()).id,
                total: 1, amount: 1, subtotal: 1,
            },
        })

        assert.equal(created.status, 201)
        const { pricing, amount } = created.body.data
        assert.equal(pricing.subtotal, item.price * 2)
        assert.notEqual(pricing.total, 1)
        // Razorpay is charged the server's number, in paise.
        assert.equal(amount, pricing.total * 100)
    })

    it('creates a pending order that is not yet payable-looking', async () => {
        const created = await startPayment()
        const order = await Order.findOne({ orderNumber: created.body.data.orderNumber })
        assert.equal(order.status, 'pending_payment')
        assert.equal(order.payment.status, 'pending')
        assert.ok(order.payment.razorpayOrderId)
    })

    it('never returns the Razorpay secret', async () => {
        const created = await startPayment()
        const body = JSON.stringify(created.body)
        assert.ok(!body.includes(TEST_SECRET), 'secret must never reach the client')
        assert.equal(created.body.data.razorpayKeyId, 'rzp_test_fake')
    })

    it('issues a readable, unique order number', async () => {
        const a = await startPayment()
        const b = await startPayment()
        const numberA = a.body.data.orderNumber

        assert.match(numberA, /^MR-[A-Z2-9]{6}$/)
        assert.ok(!/[OI01L]/.test(numberA.slice(3)), 'ambiguous characters must be excluded')
        assert.notEqual(numberA, b.body.data.orderNumber)
    })

    it('applies a valid offer to the charged amount', async () => {
        const plain = await startPayment()
        const discounted = await startPayment({ offerCode: 'FIRSTORDER' })
        assert.ok(discounted.body.data.pricing.discount > 0)
        assert.ok(discounted.body.data.pricing.total < plain.body.data.pricing.total)
    })
})

describe('payments/verify', () => {
    it('confirms the order when the signature is valid', async () => {
        const { verified, orderNumber } = await payFully()

        assert.equal(verified.status, 200)
        assert.equal(verified.body.data.alreadyConfirmed, false)
        assert.equal(verified.body.data.order.status, 'confirmed')
        assert.equal(verified.body.data.order.paymentStatus, 'paid')

        const stored = await Order.findOne({ orderNumber })
        assert.equal(stored.status, 'confirmed')
        assert.equal(stored.payment.status, 'paid')
        assert.ok(stored.confirmedAt)
    })

    it('rejects a forged signature and leaves the order unpaid', async () => {
        const created = await startPayment()
        const { razorpayOrderId, orderNumber } = created.body.data

        const res = await api('/api/v2/payments/verify', {
            method: 'POST', token,
            body: { razorpayOrderId, razorpayPaymentId: 'pay_FORGED', signature: 'not-a-real-signature' },
        })

        assert.equal(res.status, 400)
        assert.equal(res.body.error.code, 'PAYMENT_VERIFICATION_FAILED')
        assert.match(res.body.error.message, /cart hasn't been cleared/i)

        const stored = await Order.findOne({ orderNumber })
        assert.equal(stored.status, 'pending_payment')
        assert.equal(stored.payment.status, 'pending')
    })

    it('rejects a signature made with the wrong secret', async () => {
        const created = await startPayment()
        const { razorpayOrderId } = created.body.data
        const paymentId = 'pay_WRONGSECRET'
        const bad = crypto.createHmac('sha256', 'a-different-secret')
            .update(`${razorpayOrderId}|${paymentId}`).digest('hex')

        const res = await api('/api/v2/payments/verify', {
            method: 'POST', token,
            body: { razorpayOrderId, razorpayPaymentId: paymentId, signature: bad },
        })
        assert.equal(res.status, 400)
    })

    it('is idempotent — replaying verification confirms nothing twice', async () => {
        const { razorpayOrderId, paymentId, orderNumber } = await payFully()

        const replay = await api('/api/v2/payments/verify', {
            method: 'POST', token,
            body: { razorpayOrderId, razorpayPaymentId: paymentId, signature: sign(razorpayOrderId, paymentId) },
        })

        assert.equal(replay.status, 200)
        assert.equal(replay.body.data.alreadyConfirmed, true)
        assert.equal(replay.body.data.order.orderNumber, orderNumber)

        const count = await Order.countDocuments({ 'payment.razorpayPaymentId': paymentId })
        assert.equal(count, 1, 'one payment must never produce two orders')
    })

    it('will not let another user verify your payment', async () => {
        const created = await startPayment()
        const { razorpayOrderId } = created.body.data
        const paymentId = 'pay_NOTYOURS'

        const res = await api('/api/v2/payments/verify', {
            method: 'POST', token: otherToken,
            body: { razorpayOrderId, razorpayPaymentId: paymentId, signature: sign(razorpayOrderId, paymentId) },
        })
        assert.equal(res.status, 404)
        assert.equal(res.body.error.code, 'ORDER_NOT_FOUND')
    })

    it('records a dismissal without paying or cancelling', async () => {
        const created = await startPayment()
        const { razorpayOrderId, orderNumber } = created.body.data

        const res = await api('/api/v2/payments/failed', {
            method: 'POST', token, body: { razorpayOrderId, reason: 'dismissed' },
        })
        assert.equal(res.status, 200)
        assert.equal(res.body.data.retryable, true)

        const stored = await Order.findOne({ orderNumber })
        assert.equal(stored.payment.status, 'pending')
        assert.equal(stored.payment.attempts.length, 1)
    })
})

describe('orders', () => {
    it('snapshots the purchase so later menu changes cannot rewrite it', async () => {
        const item = dish('Mutton Dum Biryani')
        const { orderNumber } = await payFully({
            items: [{ menuItemId: item.id, quantity: 2 }],
        })

        const { MenuItem } = await import('../models/v2/menuItem.js')
        await MenuItem.findByIdAndUpdate(item.id, { price: 9999, name: 'Renamed Dish' })

        const res = await api(`/api/v2/orders/${orderNumber}`, { token })
        assert.equal(res.body.data.items[0].name, 'Mutton Dum Biryani')
        assert.equal(res.body.data.items[0].unitPrice, item.price)

        await MenuItem.findByIdAndUpdate(item.id, { price: item.price, name: item.name })
    })

    it('keeps the delivery address even after it is deleted', async () => {
        const created = await addAddress()
        const { orderNumber } = await payFully({ addressId: created.id })
        await api(`/api/v2/addresses/${created.id}`, { method: 'DELETE', token })

        const res = await api(`/api/v2/orders/${orderNumber}`, { token })
        assert.equal(res.status, 200)
        assert.equal(res.body.data.deliveryAddress.addressLine1, address.addressLine1)
    })

    it('lists only your own orders, split into active and past', async () => {
        const res = await api('/api/v2/orders', { token })
        assert.equal(res.status, 200)
        assert.ok(Array.isArray(res.body.data.active))
        assert.ok(Array.isArray(res.body.data.past))

        const mine = await api('/api/v2/orders', { token: otherToken })
        assert.equal(mine.body.data.active.length + mine.body.data.past.length, 0)
    })

    it('hides unpaid orders from history', async () => {
        const created = await startPayment()
        const res = await api('/api/v2/orders', { token })
        const all = [...res.body.data.active, ...res.body.data.past]
        assert.ok(!all.some((o) => o.orderNumber === created.body.data.orderNumber))
    })

    it("gives the same 404 for someone else's order as for one that doesn't exist", async () => {
        const { orderNumber } = await payFully()

        const theirs = await api(`/api/v2/orders/${orderNumber}`, { token: otherToken })
        const missing = await api('/api/v2/orders/MR-ZZZZZZ', { token: otherToken })

        assert.equal(theirs.status, 404)
        assert.equal(missing.status, 404)
        assert.deepEqual(theirs.body.error, missing.body.error, 'responses must be indistinguishable')
    })

    it('never exposes provider payment ids to the client', async () => {
        const { orderNumber, paymentId } = await payFully()
        const res = await api(`/api/v2/orders/${orderNumber}`, { token })
        const body = JSON.stringify(res.body)
        assert.ok(!body.includes(paymentId))
        assert.ok(!body.includes('razorpay'))
    })

    it('progresses through the demo timeline', async () => {
        const { orderNumber } = await payFully()

        const fresh = await api(`/api/v2/orders/${orderNumber}`, { token })
        assert.equal(fresh.body.data.status, 'confirmed')

        // Wind the clock back past the delivery threshold.
        await Order.updateOne({ orderNumber }, { confirmedAt: new Date(Date.now() - 10 * 60000) })

        const later = await api(`/api/v2/orders/${orderNumber}`, { token })
        assert.equal(later.body.data.status, 'delivered')
        assert.ok(later.body.data.statusHistory.length >= 2)
    })
})

describe('reorder', () => {
    it('returns a cart payload of still-available items', async () => {
        const { orderNumber } = await payFully({
            items: [{ menuItemId: dish('Mutton Dum Biryani').id, quantity: 2 }],
        })

        const res = await api(`/api/v2/orders/${orderNumber}/reorder`, { method: 'POST', token })
        assert.equal(res.status, 200)
        assert.equal(res.body.data.restaurantSlug, 'dum-street')
        assert.equal(res.body.data.items[0].quantity, 2)
        assert.deepEqual(res.body.data.unavailable, [])
    })

    it('reports unavailable items instead of substituting them', async () => {
        const keep = dish('Mutton Dum Biryani')
        const gone = dish('Chicken 65')
        const { orderNumber } = await payFully({
            items: [{ menuItemId: keep.id, quantity: 1 }, { menuItemId: gone.id, quantity: 1 }],
        })

        const { MenuItem } = await import('../models/v2/menuItem.js')
        await MenuItem.findByIdAndUpdate(gone.id, { isAvailable: false })

        const res = await api(`/api/v2/orders/${orderNumber}/reorder`, { method: 'POST', token })
        assert.equal(res.status, 200)
        assert.equal(res.body.data.items.length, 1)
        assert.deepEqual(res.body.data.unavailable, ['Chicken 65'])

        await MenuItem.findByIdAndUpdate(gone.id, { isAvailable: true })
    })

    it("will not reorder someone else's order", async () => {
        const { orderNumber } = await payFully()
        const res = await api(`/api/v2/orders/${orderNumber}/reorder`, { method: 'POST', token: otherToken })
        assert.equal(res.status, 404)
    })
})

describe('favourites', () => {
    it('requires authentication', async () => {
        assert.equal((await api('/api/v2/favourites')).status, 401)
    })

    it('toggles on and off', async () => {
        const on = await api('/api/v2/favourites', {
            method: 'POST', token, body: { restaurantId: restaurant.id },
        })
        assert.equal(on.body.data.isFavourite, true)
        assert.equal((await api('/api/v2/favourites', { token })).body.data.length, 1)

        const off = await api('/api/v2/favourites', {
            method: 'POST', token, body: { restaurantId: restaurant.id },
        })
        assert.equal(off.body.data.isFavourite, false)
        assert.equal((await api('/api/v2/favourites', { token })).body.data.length, 0)
    })

    it('returns the standard restaurant card shape', async () => {
        await api('/api/v2/favourites', { method: 'POST', token, body: { restaurantId: restaurant.id } })
        const res = await api('/api/v2/favourites', { token })
        const card = res.body.data[0]
        assert.ok(card.slug && card.name && card.rating && typeof card.deliveryTimeMinutes === 'number')
    })
})
