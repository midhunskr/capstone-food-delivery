import express from 'express'
import { authenticate } from '../../middlewares/v2/authenticate.js'
import { validate } from '../../middlewares/v2/validate.js'
import { quoteSchema } from '../../validators/v2/checkoutValidators.js'
import { createQuote } from '../../controllers/v2/checkoutController.js'

const router = express.Router()

// Checkout is the point where an account becomes required.
router.post('/quote', authenticate, validate({ body: quoteSchema }), createQuote)

export default router
