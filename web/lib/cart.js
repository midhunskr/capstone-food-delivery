'use client'

import { useSyncExternalStore } from 'react'

/**
 * Cart state.
 *
 * Client-owned so interaction is instant, server-validated at checkout. Prices
 * cached here are for *display only* — the payable amount always comes from
 * POST /checkout/quote. Nothing here is trusted with money.
 *
 * A tiny external store rather than a state library: the whole surface is five
 * functions and it has to survive a page refresh, which localStorage does on
 * its own.
 */

const STORAGE_KEY = 'food.cart.v1'

const EMPTY = { restaurantId: null, restaurantSlug: null, restaurantName: null, items: [] }

let state = EMPTY
let hydrated = false
const listeners = new Set()

const read = () => {
    try {
        const raw = localStorage.getItem(STORAGE_KEY)
        if (!raw) return EMPTY
        const parsed = JSON.parse(raw)
        if (!parsed?.items || !Array.isArray(parsed.items)) return EMPTY
        return parsed
    } catch {
        // Corrupt or unavailable storage should never break the app.
        return EMPTY
    }
}

const write = (next) => {
    state = next
    try {
        if (next.items.length === 0) localStorage.removeItem(STORAGE_KEY)
        else localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
    } catch { /* private mode, quota — the in-memory cart still works */ }
    listeners.forEach((l) => l())
}

const ensureHydrated = () => {
    if (hydrated || typeof window === 'undefined') return
    hydrated = true
    state = read()
}

const subscribe = (listener) => {
    ensureHydrated()
    listeners.add(listener)

    // Keep two tabs in step.
    const onStorage = (event) => {
        if (event.key === STORAGE_KEY) {
            state = read()
            listeners.forEach((l) => l())
        }
    }
    window.addEventListener('storage', onStorage)

    return () => {
        listeners.delete(listener)
        window.removeEventListener('storage', onStorage)
    }
}

const getSnapshot = () => {
    ensureHydrated()
    return state
}

// The server has no cart. Returning the same empty object keeps the first
// client render identical to the server's, so there is no hydration mismatch.
const getServerSnapshot = () => EMPTY

export const useCart = () => useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)

/** Quantity of one item, for the stepper on a menu row. */
export const useItemQuantity = (menuItemId) => {
    const cart = useCart()
    return cart.items.find((i) => i.menuItemId === menuItemId)?.quantity ?? 0
}

/** Total number of things in the cart — not the number of distinct lines. */
export const cartCount = (cart) => cart.items.reduce((n, i) => n + i.quantity, 0)

/** Indicative only. Real money comes from the server quote. */
export const cartSubtotal = (cart) =>
    cart.items.reduce((n, i) => n + (i.price ?? 0) * i.quantity, 0)

export const isSameRestaurant = (cart, restaurantId) =>
    cart.items.length === 0 || cart.restaurantId === restaurantId

/**
 * Adds one of an item. Returns 'added', or 'conflict' when the cart belongs to
 * a different restaurant — the caller then asks the user what to do rather than
 * silently clearing their food.
 */
export const addItem = (item, restaurant) => {
    ensureHydrated()

    if (!isSameRestaurant(state, restaurant.id)) return 'conflict'

    const existing = state.items.find((i) => i.menuItemId === item.id)

    const items = existing
        ? state.items.map((i) =>
            i.menuItemId === item.id ? { ...i, quantity: i.quantity + 1 } : i)
        : [...state.items, {
            menuItemId: item.id,
            name: item.name,
            price: item.price,
            image: item.image ?? null,
            isVeg: !!item.isVeg,
            quantity: 1,
        }]

    write({
        restaurantId: restaurant.id,
        restaurantSlug: restaurant.slug,
        restaurantName: restaurant.name,
        items,
    })
    return 'added'
}

/** Clears whatever was there and starts fresh with this item. */
export const replaceCartWith = (item, restaurant) => {
    ensureHydrated()
    write({ ...EMPTY, items: [] })
    return addItem(item, restaurant)
}

export const setQuantity = (menuItemId, quantity) => {
    ensureHydrated()

    // Reaching zero removes the line. There is no such thing as a negative
    // quantity, and an item stuck at 1 that cannot be removed was a real bug in
    // the app this replaces.
    if (quantity <= 0) return removeItem(menuItemId)

    write({
        ...state,
        items: state.items.map((i) =>
            i.menuItemId === menuItemId ? { ...i, quantity: Math.min(quantity, 20) } : i),
    })
}

export const incrementItem = (menuItemId) => {
    ensureHydrated()
    const current = state.items.find((i) => i.menuItemId === menuItemId)
    setQuantity(menuItemId, (current?.quantity ?? 0) + 1)
}

export const decrementItem = (menuItemId) => {
    ensureHydrated()
    const current = state.items.find((i) => i.menuItemId === menuItemId)
    setQuantity(menuItemId, (current?.quantity ?? 0) - 1)
}

export const removeItem = (menuItemId) => {
    ensureHydrated()
    const items = state.items.filter((i) => i.menuItemId !== menuItemId)
    write(items.length === 0 ? EMPTY : { ...state, items })
}

export const clearCart = () => {
    ensureHydrated()
    write(EMPTY)
}

/** The payload the server prices. Ids and quantities only. */
export const toQuotePayload = (cart) => ({
    restaurantId: cart.restaurantId,
    items: cart.items.map((i) => ({ menuItemId: i.menuItemId, quantity: i.quantity })),
})
