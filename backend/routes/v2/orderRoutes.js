import express from 'express'
import { authenticate } from '../../middlewares/v2/authenticate.js'
import { validate } from '../../middlewares/v2/validate.js'
import { listOrdersSchema, orderNumberSchema } from '../../validators/v2/orderValidators.js'
import { listOrders, getOrder, reorder } from '../../controllers/v2/orderController.js'

const router = express.Router()

router.use(authenticate)

router.get('/', validate({ query: listOrdersSchema }), listOrders)
router.get('/:orderNumber', validate({ params: orderNumberSchema }), getOrder)
router.post('/:orderNumber/reorder', validate({ params: orderNumberSchema }), reorder)

export default router
