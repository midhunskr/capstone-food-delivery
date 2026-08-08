import { env } from '../config/env.js'

/**
 * Order progression.
 *
 * There is no kitchen and no rider, so status is derived from how long ago the
 * order was confirmed and persisted when it changes. No cron, no queue, no
 * worker — a read computes the status it should be by now and saves it if that
 * differs.
 *
 * Demo acceleration compresses the whole journey into a couple of minutes so a
 * reviewer can watch it happen. The customer-facing ETA stays realistic either
 * way; only the state machine is sped up.
 */

const FLOW = ['confirmed', 'preparing', 'on_the_way', 'delivered']

/** Terminal states never get recomputed. */
const TERMINAL = new Set(['delivered', 'cancelled', 'payment_failed', 'pending_payment'])

/**
 * Elapsed minutes at which each state begins, as fractions of the restaurant's
 * quoted delivery time (or of the demo window when acceleration is on).
 */
const THRESHOLDS = [
    { status: 'confirmed', at: 0 },
    { status: 'preparing', at: 0.15 },
    { status: 'on_the_way', at: 0.5 },
    { status: 'delivered', at: 1 },
]

export const statusRank = (status) => FLOW.indexOf(status)

/**
 * What the status should be right now. Returns null when nothing should change.
 */
export const deriveStatus = (order, now = Date.now()) => {
    if (TERMINAL.has(order.status)) return null
    if (!order.confirmedAt) return null

    const windowMinutes = env.demoOrderAcceleration
        ? env.demoOrderWindowMinutes
        : (order.restaurant?.deliveryTimeMinutes || 30)

    const elapsedMinutes = (now - new Date(order.confirmedAt).getTime()) / 60000
    const progress = windowMinutes > 0 ? elapsedMinutes / windowMinutes : 0

    let next = 'confirmed'
    for (const threshold of THRESHOLDS) {
        if (progress >= threshold.at) next = threshold.status
    }

    return next === order.status ? null : next
}

/**
 * Advances a persisted order to whatever status it has earned. Safe to call on
 * every read — it only writes when the status actually moves.
 */
export const advanceOrder = async (order) => {
    const next = deriveStatus(order)
    if (!next) return order

    order.status = next
    order.statusHistory.push({ status: next, at: new Date() })
    if (next === 'delivered') order.deliveredAt = new Date()

    await order.save()
    return order
}

export const advanceOrders = (orders) => Promise.all(orders.map(advanceOrder))
