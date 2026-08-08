import express from 'express'
import { authenticate } from '../../middlewares/v2/authenticate.js'
import { validate } from '../../middlewares/v2/validate.js'
import {
    createPaymentSchema, verifyPaymentSchema, paymentFailedSchema,
} from '../../validators/v2/paymentValidators.js'
import {
    createPayment, verifyPayment, recordPaymentFailure,
} from '../../controllers/v2/paymentController.js'

const router = express.Router()

router.use(authenticate)

router.post('/create', validate({ body: createPaymentSchema }), createPayment)
router.post('/verify', validate({ body: verifyPaymentSchema }), verifyPayment)
router.post('/failed', validate({ body: paymentFailedSchema }), recordPaymentFailure)

export default router
