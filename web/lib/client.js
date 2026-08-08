'use client'

/**
 * Browser → Next.js calls. Same-origin only; the session cookie rides along and
 * the Express token is attached server-side.
 *
 * Never throws — returns { ok, data, error } so components can render a state
 * instead of falling over.
 */
export const clientFetch = async (path, { method = 'GET', body } = {}) => {
    try {
        const res = await fetch(path, {
            method,
            headers: body === undefined ? undefined : { 'Content-Type': 'application/json' },
            body: body === undefined ? undefined : JSON.stringify(body),
        })
        const json = await res.json().catch(() => null)

        if (!res.ok || !json?.ok) {
            return {
                ok: false,
                status: res.status,
                error: json?.error ?? { code: 'NETWORK', message: 'Something went wrong. Try again.' },
            }
        }
        return { ok: true, status: res.status, data: json.data }
    } catch {
        return {
            ok: false,
            status: 0,
            error: { code: 'OFFLINE', message: "You're offline. Check your connection and try again." },
        }
    }
}

/**
 * Authoritative pricing. The only source of a payable amount.
 *
 * Optional fields are omitted rather than sent as null — the API treats absent
 * and null differently, and "no offer applied" means absent.
 */
export const fetchQuote = ({ restaurantId, items, offerCode, addressId }) =>
    clientFetch('/api/proxy/checkout/quote', {
        method: 'POST',
        body: {
            restaurantId,
            items,
            ...(offerCode ? { offerCode } : {}),
            ...(addressId ? { addressId } : {}),
        },
    })

export const listAddresses = () => clientFetch('/api/proxy/addresses')
export const createAddress = (body) => clientFetch('/api/proxy/addresses', { method: 'POST', body })
export const updateAddress = (id, body) =>
    clientFetch(`/api/proxy/addresses/${id}`, { method: 'PATCH', body })
export const deleteAddress = (id) => clientFetch(`/api/proxy/addresses/${id}`, { method: 'DELETE' })
export const makeAddressDefault = (id) =>
    clientFetch(`/api/proxy/addresses/${id}/default`, { method: 'POST' })

/** Starts a payment. The server prices it; nothing about money is sent. */
export const createPayment = ({ restaurantId, items, offerCode, addressId }) =>
    clientFetch('/api/proxy/payments/create', {
        method: 'POST',
        body: { restaurantId, items, addressId, ...(offerCode ? { offerCode } : {}) },
    })

/** The security boundary: an order only becomes paid if this succeeds. */
export const verifyPayment = ({ razorpayOrderId, razorpayPaymentId, signature }) =>
    clientFetch('/api/proxy/payments/verify', {
        method: 'POST',
        body: { razorpayOrderId, razorpayPaymentId, signature },
    })

export const reportPaymentFailure = ({ razorpayOrderId, reason }) =>
    clientFetch('/api/proxy/payments/failed', { method: 'POST', body: { razorpayOrderId, reason } })

export const fetchOrder = (orderNumber) => clientFetch(`/api/proxy/orders/${orderNumber}`)
export const reorder = (orderNumber) =>
    clientFetch(`/api/proxy/orders/${orderNumber}/reorder`, { method: 'POST' })

export const toggleFavourite = (restaurantId) =>
    clientFetch('/api/proxy/favourites', { method: 'POST', body: { restaurantId } })
