import express from 'express'
import authRoutes from './authRoutes.js'
import discoveryRoutes from './discoveryRoutes.js'
import addressRoutes from './addressRoutes.js'
import checkoutRoutes from './checkoutRoutes.js'
import paymentRoutes from './paymentRoutes.js'
import orderRoutes from './orderRoutes.js'
import favouriteRoutes from './favouriteRoutes.js'
import { generalLimiter } from '../../middlewares/v2/rateLimiters.js'
import { requireDb } from '../../middlewares/v2/requireDb.js'
import { isDbConnected } from '../../config/db.js'
import { sendSuccess } from '../../utils/apiResponse.js'

/**
 * /api/v2 — the new customer-facing API.
 *
 * Discovery, cart pricing, addresses, offers, checkout, orders, reviews and
 * favourites all mount here in later phases.
 */
const v2Router = express.Router()

v2Router.use(generalLimiter)

/**
 * Liveness — is the HTTP server itself up? Answers as soon as the process is
 * listening, independent of database state, so Render (or anything else)
 * calling this can tell the process is alive even mid-Mongo-outage.
 *
 * Keeps the standard { ok, data } envelope — this is still a v2 API response,
 * just one whose data now reports connection state instead of a bare 'ok'.
 */
v2Router.get('/health', (req, res) => sendSuccess(res, {
    status: 'ok',
    server: 'up',
    database: isDbConnected() ? 'connected' : 'disconnected',
}))

/**
 * Readiness — is it safe to route real traffic here? 200 only once Mongo is
 * connected, 503 otherwise. Distinct from /health so an orchestrator can tell
 * "the process is alive" apart from "it can actually serve requests".
 */
v2Router.get('/ready', (req, res) => {
    if (isDbConnected()) {
        return res.status(200).json({ status: 'ready' })
    }
    return res.status(503).json({ status: 'not_ready' })
})

// Everything below needs Mongo — /health and /ready above are exempt.
v2Router.use(requireDb)

v2Router.use('/auth', authRoutes)
v2Router.use('/addresses', addressRoutes)
v2Router.use('/checkout', checkoutRoutes)
v2Router.use('/payments', paymentRoutes)
v2Router.use('/orders', orderRoutes)
v2Router.use('/favourites', favouriteRoutes)
// Discovery is mounted last: it owns the remaining top-level paths.
v2Router.use('/', discoveryRoutes)

export default v2Router
