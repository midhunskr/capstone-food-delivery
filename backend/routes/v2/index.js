import express from 'express'
import authRoutes from './authRoutes.js'
import discoveryRoutes from './discoveryRoutes.js'
import addressRoutes from './addressRoutes.js'
import checkoutRoutes from './checkoutRoutes.js'
import paymentRoutes from './paymentRoutes.js'
import orderRoutes from './orderRoutes.js'
import favouriteRoutes from './favouriteRoutes.js'
import { generalLimiter } from '../../middlewares/v2/rateLimiters.js'
import { sendSuccess } from '../../utils/apiResponse.js'

/**
 * /api/v2 — the new customer-facing API.
 *
 * Discovery, cart pricing, addresses, offers, checkout, orders, reviews and
 * favourites all mount here in later phases.
 */
const v2Router = express.Router()

v2Router.use(generalLimiter)

// Cheap liveness check — useful for Render health checks and for confirming a
// deploy is actually serving v2.
v2Router.get('/health', (req, res) => sendSuccess(res, { status: 'ok' }))

v2Router.use('/auth', authRoutes)
v2Router.use('/addresses', addressRoutes)
v2Router.use('/checkout', checkoutRoutes)
v2Router.use('/payments', paymentRoutes)
v2Router.use('/orders', orderRoutes)
v2Router.use('/favourites', favouriteRoutes)
// Discovery is mounted last: it owns the remaining top-level paths.
v2Router.use('/', discoveryRoutes)

export default v2Router
