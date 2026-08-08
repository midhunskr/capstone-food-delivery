import { after, before, describe, it } from 'node:test'
import assert from 'node:assert/strict'
import { api, startTestServer, stopTestServer } from './helpers.js'
import { seedDatabase } from '../seed/index.js'

let token, otherToken
let restaurant, menu

const address = {
    label: 'home',
    recipientName: 'Aarti Menon',
    phone: '9847012345',
    addressLine1: 'Flat 4B, Palm Grove Apartments',
    area: 'Panampilly Nagar',
    city: 'Kochi',
    state: 'Kerala',
    postalCode: '682036',
}

before(async () => {
    await startTestServer()
    await seedDatabase()

    const register = async (email) => {
        const res = await api('/api/v2/auth/register', {
            method: 'POST',
            body: { name: 'Test Person', email, password: 'goodpassword1' },
        })
        return res.body.data.token
    }
    token = await register('commerce@example.com')
    otherToken = await register('other@example.com')

    restaurant = (await api('/api/v2/restaurants/dum-street')).body.data
    menu = (await api('/api/v2/restaurants/dum-street/menu')).body.data
})

after(async () => { await stopTestServer() })

const itemsFrom = (names) => names.map((name) => {
    const item = menu.sections.flatMap((s) => s.items).find((i) => i.name === name)
    return { menuItemId: item.id, quantity: 1, price: item.price }
})

const quote = (body, opts = {}) =>
    api('/api/v2/checkout/quote', { method: 'POST', body, token, ...opts })

describe('addresses', () => {
    let created

    it('requires authentication', async () => {
        const res = await api('/api/v2/addresses')
        assert.equal(res.status, 401)
    })

    it('starts empty', async () => {
        const res = await api('/api/v2/addresses', { token })
        assert.equal(res.status, 200)
        assert.deepEqual(res.body.data, [])
    })

    it('creates an address', async () => {
        const res = await api('/api/v2/addresses', { method: 'POST', body: address, token })
        assert.equal(res.status, 201)
        assert.equal(res.body.data.city, 'Kochi')
        assert.equal(res.body.data.addressLine1, address.addressLine1)
        created = res.body.data
    })

    it('makes the first address default automatically', () => {
        assert.equal(created.isDefault, true)
    })

    it('validates required fields with human messages', async () => {
        const res = await api('/api/v2/addresses', {
            method: 'POST', token,
            body: { addressLine1: 'x', city: '', postalCode: '12' },
        })
        assert.equal(res.status, 400)
        assert.equal(res.body.error.code, 'VALIDATION_FAILED')
        assert.equal(res.body.error.details.postalCode, 'A PIN code is 6 digits.')
        assert.ok(res.body.error.details.city)
    })

    it('rejects a non-numeric PIN code', async () => {
        const res = await api('/api/v2/addresses', {
            method: 'POST', token, body: { ...address, postalCode: 'ABC123' },
        })
        assert.equal(res.status, 400)
    })

    it('holds multiple addresses', async () => {
        await api('/api/v2/addresses', {
            method: 'POST', token,
            body: { ...address, label: 'work', addressLine1: 'Infopark Phase 1', area: 'Kakkanad' },
        })
        const res = await api('/api/v2/addresses', { token })
        assert.equal(res.body.data.length, 2)
    })

    it('keeps exactly one default and lists it first', async () => {
        const res = await api('/api/v2/addresses', { token })
        assert.equal(res.body.data.filter((a) => a.isDefault).length, 1)
        assert.equal(res.body.data[0].isDefault, true)
    })

    it('changes the default', async () => {
        const list = (await api('/api/v2/addresses', { token })).body.data
        const other = list.find((a) => !a.isDefault)

        const res = await api(`/api/v2/addresses/${other.id}/default`, { method: 'POST', token })
        assert.equal(res.status, 200)
        assert.equal(res.body.data.isDefault, true)

        const after = (await api('/api/v2/addresses', { token })).body.data
        assert.equal(after.filter((a) => a.isDefault).length, 1)
        assert.equal(after.find((a) => a.id === other.id).isDefault, true)
    })

    it('updates an address', async () => {
        const res = await api(`/api/v2/addresses/${created.id}`, {
            method: 'PATCH', token, body: { landmark: 'Opposite the temple' },
        })
        assert.equal(res.status, 200)
        assert.equal(res.body.data.landmark, 'Opposite the temple')
        assert.equal(res.body.data.addressLine1, address.addressLine1, 'other fields untouched')
    })

    it('never exposes another user’s address', async () => {
        const res = await api(`/api/v2/addresses/${created.id}`, {
            method: 'PATCH', token: otherToken, body: { landmark: 'hacked' },
        })
        assert.equal(res.status, 404)
        assert.equal(res.body.error.code, 'ADDRESS_NOT_FOUND')
    })

    it('will not let another user delete an address', async () => {
        const res = await api(`/api/v2/addresses/${created.id}`, { method: 'DELETE', token: otherToken })
        assert.equal(res.status, 404)
        const still = (await api('/api/v2/addresses', { token })).body.data
        assert.ok(still.some((a) => a.id === created.id), 'address must survive')
    })

    it('deletes a non-default address without changing the default', async () => {
        const list = (await api('/api/v2/addresses', { token })).body.data
        const nonDefault = list.find((a) => !a.isDefault)
        const defaultId = list.find((a) => a.isDefault).id

        await api(`/api/v2/addresses/${nonDefault.id}`, { method: 'DELETE', token })

        const after = (await api('/api/v2/addresses', { token })).body.data
        assert.equal(after.length, 1)
        assert.equal(after[0].id, defaultId)
        assert.equal(after[0].isDefault, true)
    })

    it('promotes another address when the default is deleted', async () => {
        await api('/api/v2/addresses', {
            method: 'POST', token,
            body: { ...address, label: 'other', addressLine1: 'Marine Drive Walkway' },
        })
        const list = (await api('/api/v2/addresses', { token })).body.data
        const currentDefault = list.find((a) => a.isDefault)

        await api(`/api/v2/addresses/${currentDefault.id}`, { method: 'DELETE', token })

        const after = (await api('/api/v2/addresses', { token })).body.data
        assert.equal(after.length, 1)
        assert.equal(after[0].isDefault, true, 'survivor must become default')
    })

    it('404s an unknown address id', async () => {
        const res = await api('/api/v2/addresses/507f1f77bcf86cd799439011', { method: 'DELETE', token })
        assert.equal(res.status, 404)
    })

    // Regression: a form that leaves optional fields blank may send "" or null.
    // Both mean "not provided" and must not become a validation error.
    it('accepts blank optional fields sent as empty strings', async () => {
        const res = await api('/api/v2/addresses', {
            method: 'POST', token,
            body: {
                label: 'home', customLabel: '', recipientName: '', phone: '',
                addressLine1: 'Blank Optionals Test', addressLine2: '', area: '',
                city: 'Kochi', state: 'Kerala', postalCode: '682036', landmark: '',
            },
        })
        assert.equal(res.status, 201, JSON.stringify(res.body))
        assert.equal(res.body.data.landmark, null)
        assert.equal(res.body.data.phone, null)
        await api(`/api/v2/addresses/${res.body.data.id}`, { method: 'DELETE', token })
    })

    it('accepts blank optional fields sent as null', async () => {
        const res = await api('/api/v2/addresses', {
            method: 'POST', token,
            body: {
                label: 'home', customLabel: null, recipientName: null, phone: null,
                addressLine1: 'Null Optionals Test', addressLine2: null, area: null,
                city: 'Kochi', state: null, postalCode: '682036', landmark: null,
                latitude: null, longitude: null, isDefault: null,
            },
        })
        assert.equal(res.status, 201, JSON.stringify(res.body))
        await api(`/api/v2/addresses/${res.body.data.id}`, { method: 'DELETE', token })
    })

    it('still rejects a genuinely bad phone number', async () => {
        const res = await api('/api/v2/addresses', {
            method: 'POST', token, body: { ...address, phone: '12' },
        })
        assert.equal(res.status, 400)
        assert.ok(res.body.error.details.phone)
    })
})

describe('checkout quote — auth and validation', () => {
    it('requires authentication', async () => {
        const items = itemsFrom(['Chicken Dum Biryani'])
        const res = await api('/api/v2/checkout/quote', {
            method: 'POST', body: { restaurantId: restaurant.id, items },
        })
        assert.equal(res.status, 401)
        assert.equal(res.body.error.code, 'AUTH_REQUIRED')
    })

    it('rejects an empty cart', async () => {
        const res = await quote({ restaurantId: restaurant.id, items: [] })
        assert.equal(res.status, 400)
    })

    it('rejects a bad quantity', async () => {
        const [item] = itemsFrom(['Chicken Dum Biryani'])
        const res = await quote({ restaurantId: restaurant.id, items: [{ ...item, quantity: 0 }] })
        assert.equal(res.status, 400)
    })

    it('rejects an unknown restaurant', async () => {
        const items = itemsFrom(['Chicken Dum Biryani'])
        const res = await quote({ restaurantId: '507f1f77bcf86cd799439011', items })
        assert.equal(res.status, 404)
        assert.equal(res.body.error.code, 'RESTAURANT_UNAVAILABLE')
    })

    it('rejects an address belonging to someone else', async () => {
        const mine = (await api('/api/v2/addresses', { method: 'POST', body: address, token: otherToken })).body.data
        const items = itemsFrom(['Chicken Dum Biryani'])
        const res = await quote({ restaurantId: restaurant.id, items, addressId: mine.id })
        assert.equal(res.status, 404)
        assert.equal(res.body.error.code, 'ADDRESS_NOT_FOUND')
    })

    it('drops items from another restaurant rather than pricing them', async () => {
        const otherMenu = (await api('/api/v2/restaurants/wok-lane/menu')).body.data
        const foreign = otherMenu.sections[0].items[0]
        const mine = itemsFrom(['Chicken Dum Biryani'])

        const res = await quote({
            restaurantId: restaurant.id,
            items: [...mine, { menuItemId: foreign.id, quantity: 1 }],
        })

        assert.equal(res.status, 200)
        assert.equal(res.body.data.items.length, 1, 'foreign item must not be priced')
        assert.ok(res.body.data.warnings.some((w) => w.code === 'ITEM_NOT_FOUND'))
    })
})

describe('checkout quote — authoritative pricing', () => {
    it('prices from the database, ignoring anything the client sends', async () => {
        const [item] = itemsFrom(['Chicken Dum Biryani'])
        const res = await quote({
            restaurantId: restaurant.id,
            // A client trying to set its own price/total.
            items: [{ menuItemId: item.menuItemId, quantity: 1, price: 1, unitPrice: 1, lineTotal: 1 }],
            subtotal: 1, total: 1,
        })

        assert.equal(res.status, 200)
        assert.equal(res.body.data.items[0].unitPrice, item.price)
        assert.equal(res.body.data.pricing.subtotal, item.price)
        assert.notEqual(res.body.data.pricing.total, 1)
    })

    it('multiplies by quantity', async () => {
        const [item] = itemsFrom(['Chicken Dum Biryani'])
        const res = await quote({
            restaurantId: restaurant.id,
            items: [{ menuItemId: item.menuItemId, quantity: 3 }],
        })
        assert.equal(res.body.data.pricing.subtotal, item.price * 3)
        assert.equal(res.body.data.items[0].lineTotal, item.price * 3)
    })

    it('sums multiple different items', async () => {
        const items = itemsFrom(['Chicken Dum Biryani', 'Chicken 65'])
        const expected = items.reduce((n, i) => n + i.price, 0)
        const res = await quote({ restaurantId: restaurant.id, items })
        assert.equal(res.body.data.pricing.subtotal, expected)
    })

    it('applies tax to the discounted item total', async () => {
        const [item] = itemsFrom(['Chicken Dum Biryani'])
        const res = await quote({ restaurantId: restaurant.id, items: [item] })
        const p = res.body.data.pricing
        assert.equal(p.tax, Math.round((p.subtotal - p.discount) * p.taxPercent / 100))
    })

    it('total always equals subtotal - discount + delivery + tax', async () => {
        const items = itemsFrom(['Chicken Dum Biryani', 'Mutton Dum Biryani', 'Chicken 65'])
        const res = await quote({ restaurantId: restaurant.id, items })
        const p = res.body.data.pricing
        assert.equal(p.total, p.subtotal - p.discount + p.deliveryFee + p.tax)
    })

    it('returns whole-rupee integers everywhere', async () => {
        const items = itemsFrom(['Chicken Dum Biryani', 'Chicken 65'])
        const p = (await quote({ restaurantId: restaurant.id, items })).body.data.pricing
        for (const [key, value] of Object.entries(p)) {
            assert.ok(Number.isInteger(value), `${key} = ${value} must be an integer`)
        }
    })

    it('waives the delivery fee above the restaurant threshold', async () => {
        // Dum Street: fee 0 already, so use a restaurant that charges one.
        const wok = (await api('/api/v2/restaurants/wok-lane')).body.data
        const wokMenu = (await api('/api/v2/restaurants/wok-lane/menu')).body.data
        const dish = wokMenu.sections.flatMap((s) => s.items)[0]

        const small = await quote({
            restaurantId: wok.id, items: [{ menuItemId: dish.id, quantity: 1 }],
        })
        const large = await quote({
            restaurantId: wok.id, items: [{ menuItemId: dish.id, quantity: 10 }],
        })

        assert.equal(small.body.data.pricing.deliveryFee, wok.deliveryFee)
        assert.ok(large.body.data.pricing.subtotal >= wok.freeDeliveryAbove)
        assert.equal(large.body.data.pricing.deliveryFee, 0, 'threshold should waive the fee')
    })

    it('flags an unavailable item instead of pricing it', async () => {
        const { MenuItem } = await import('../models/v2/menuItem.js')
        const [item] = itemsFrom(['Chicken 65'])
        await MenuItem.findByIdAndUpdate(item.menuItemId, { isAvailable: false })

        const keep = itemsFrom(['Chicken Dum Biryani'])
        const res = await quote({ restaurantId: restaurant.id, items: [...keep, item] })

        assert.equal(res.status, 200)
        assert.equal(res.body.data.items.length, 1)
        assert.ok(res.body.data.warnings.some((w) => w.code === 'ITEM_UNAVAILABLE'))
        assert.match(res.body.data.warnings[0].message, /sold out/i)

        await MenuItem.findByIdAndUpdate(item.menuItemId, { isAvailable: true })
    })

    it('errors when nothing in the cart is available', async () => {
        const res = await quote({
            restaurantId: restaurant.id,
            items: [{ menuItemId: '507f1f77bcf86cd799439011', quantity: 1 }],
        })
        assert.equal(res.status, 400)
        assert.equal(res.body.error.code, 'CART_UNAVAILABLE')
    })
})

describe('checkout quote — offers', () => {
    const bigCart = () => itemsFrom(['Mutton Dum Biryani']).map((i) => ({ ...i, quantity: 3 }))

    it('applies a percentage offer and caps it at maxDiscount', async () => {
        const res = await quote({ restaurantId: restaurant.id, items: bigCart(), offerCode: 'FIRSTORDER' })
        const { pricing, appliedOffer } = res.body.data

        assert.equal(appliedOffer.code, 'FIRSTORDER')
        const uncapped = Math.round(pricing.subtotal * 0.5)
        assert.equal(pricing.discount, Math.min(uncapped, 100))
        assert.equal(pricing.discount, 100, 'this cart should hit the cap')
    })

    it('applies a flat offer', async () => {
        const res = await quote({ restaurantId: restaurant.id, items: bigCart(), offerCode: 'SAVE75' })
        assert.equal(res.body.data.pricing.discount, 75)
        assert.equal(res.body.data.appliedOffer.code, 'SAVE75')
    })

    it('reports savings on the applied offer', async () => {
        const res = await quote({ restaurantId: restaurant.id, items: bigCart(), offerCode: 'SAVE75' })
        assert.equal(res.body.data.appliedOffer.savings, 75)
    })

    it('rejects an offer below its minimum order, and says by how much', async () => {
        const small = itemsFrom(['Sulaimani'])
        const res = await quote({ restaurantId: restaurant.id, items: small, offerCode: 'SAVE75' })

        assert.equal(res.status, 200)
        assert.equal(res.body.data.appliedOffer, null)
        assert.equal(res.body.data.pricing.discount, 0)
        assert.match(res.body.data.offerError, /minimum order of ₹349/)
        assert.match(res.body.data.offerError, /away/)
    })

    it('rejects an expired offer', async () => {
        const res = await quote({ restaurantId: restaurant.id, items: bigCart(), offerCode: 'EXPIRED10' })
        assert.equal(res.body.data.appliedOffer, null)
        assert.match(res.body.data.offerError, /expired|isn't running/i)
    })

    it('rejects an unknown code without jargon', async () => {
        const res = await quote({ restaurantId: restaurant.id, items: bigCart(), offerCode: 'NOPE123' })
        assert.equal(res.body.data.appliedOffer, null)
        assert.equal(res.body.data.offerError, "We don't recognise that code.")
    })

    it("rejects another restaurant's offer", async () => {
        const { Offer } = await import('../models/v2/offer.js')
        const { Restaurant } = await import('../models/v2/restaurant.js')
        const other = await Restaurant.findOne({ slug: 'wok-lane' })
        await Offer.create({
            code: 'WOKONLY', title: '10% off', type: 'percentage', value: 10,
            scope: 'restaurant', restaurant: other._id, isActive: true,
        })

        const res = await quote({ restaurantId: restaurant.id, items: bigCart(), offerCode: 'WOKONLY' })
        assert.equal(res.body.data.appliedOffer, null)
        assert.equal(res.body.data.offerError, "That code isn't available for this restaurant.")
    })

    it('never stacks — one offer at a time', async () => {
        const res = await quote({ restaurantId: restaurant.id, items: bigCart(), offerCode: 'SAVE75' })
        assert.equal(res.body.data.appliedOffer.code, 'SAVE75')
        assert.equal(typeof res.body.data.appliedOffer, 'object')
        assert.ok(!Array.isArray(res.body.data.appliedOffer))
    })

    it('a free-delivery offer zeroes the fee', async () => {
        const wok = (await api('/api/v2/restaurants/wok-lane')).body.data
        const wokMenu = (await api('/api/v2/restaurants/wok-lane/menu')).body.data
        const dish = wokMenu.sections.flatMap((s) => s.items)[0]

        const { Offer } = await import('../models/v2/offer.js')
        await Offer.create({
            code: 'FREEDEL', title: 'Free delivery', type: 'free_delivery',
            minimumOrder: 0, scope: 'global', isActive: true,
        })

        const res = await quote({
            restaurantId: wok.id, items: [{ menuItemId: dish.id, quantity: 1 }], offerCode: 'FREEDEL',
        })
        assert.equal(res.body.data.pricing.deliveryFee, 0)
        assert.ok(res.body.data.appliedOffer.savings > 0, 'saving should reflect the waived fee')
    })

    it('lists available offers with eligibility and reasons', async () => {
        const small = itemsFrom(['Sulaimani'])
        const res = await quote({ restaurantId: restaurant.id, items: small })
        const offers = res.body.data.availableOffers

        assert.ok(Array.isArray(offers) && offers.length > 0)
        assert.ok(offers.every((o) => typeof o.eligible === 'boolean'))
        const blocked = offers.find((o) => !o.eligible)
        assert.ok(blocked?.reason, 'an ineligible offer must explain itself')
        assert.ok(!offers.some((o) => o.code === 'EXPIRED10'), 'expired offers stay hidden')
    })
})

describe('checkout quote — address and shape', () => {
    it('returns the selected address with the quote', async () => {
        const created = (await api('/api/v2/addresses', { method: 'POST', body: address, token })).body.data
        const items = itemsFrom(['Chicken Dum Biryani'])

        const res = await quote({ restaurantId: restaurant.id, items, addressId: created.id })
        assert.equal(res.status, 200)
        assert.equal(res.body.data.address.id, created.id)
        assert.equal(res.body.data.address.city, 'Kochi')
    })

    it('prices fine without an address', async () => {
        const items = itemsFrom(['Chicken Dum Biryani'])
        const res = await quote({ restaurantId: restaurant.id, items })
        assert.equal(res.status, 200)
        assert.equal(res.body.data.address, null)
    })

    it('returns everything checkout needs and creates nothing', async () => {
        const items = itemsFrom(['Chicken Dum Biryani'])
        const res = await quote({ restaurantId: restaurant.id, items })
        const d = res.body.data

        for (const key of ['restaurant', 'items', 'pricing', 'appliedOffer', 'availableOffers', 'warnings']) {
            assert.ok(key in d, `quote must include ${key}`)
        }
        assert.ok(d.restaurant.name && d.restaurant.slug)
        assert.ok(d.items[0].name && d.items[0].image !== undefined)
        // Block E owns order creation — a quote must not mint one.
        assert.ok(!('orderId' in d) && !('orderNumber' in d) && !('razorpayOrderId' in d))
    })
})
