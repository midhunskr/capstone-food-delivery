import express from 'express'
import { admin, authUser } from '../../middlewares/authMiddleware.js'
import { createOrder, deleteOrder, getAllOrdersAdmin, getAllOrdersUser } from '../../controllers/orderController.js'

const router = express.Router()

router.route('/create').post(authUser, createOrder)
router.route('/user-orders').get(authUser, getAllOrdersUser)
router.route('/all-orders').get(authUser, admin, getAllOrdersAdmin)
router.route('/:id')
    .delete(authUser, admin, deleteOrder)

export default router