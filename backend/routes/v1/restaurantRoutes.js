import express from 'express'
import { admin, authUser } from '../../middlewares/authMiddleware.js'
import { createRestaurant, deleteRestaurant, getRestaurant, getRestaurantById, updateRestaurant } from '../../controllers/restaurantController.js'

const router = express.Router()

//Restaurant routes
router.post('/create-restaurant', authUser, admin, createRestaurant)
router.get('/all-restaurants', authUser, getRestaurant)
router.get('/restaurants/:id', authUser, getRestaurantById)
router.put('/restaurants/:id', authUser, admin, updateRestaurant)
router.delete('/restaurants/:id', authUser, admin, deleteRestaurant)

export default router