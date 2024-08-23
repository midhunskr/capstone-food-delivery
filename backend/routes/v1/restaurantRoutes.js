import express from 'express'
import { admin, authUser } from '../../middlewares/authMiddleware.js'
import { createRestaurant, deleteRestaurant, getRestaurant, getRestaurantById, updateRestaurant } from '../../controllers/restaurantController.js'

const router = express.Router()

//Restaurant routes
router.post('/create', authUser, admin, createRestaurant)
router.get('/all-restaurants', authUser, getRestaurant)
router.get('/:id', authUser, getRestaurantById)
router.put('/:id', authUser, admin, updateRestaurant)
router.delete('/:id', authUser, admin, deleteRestaurant)

export default router