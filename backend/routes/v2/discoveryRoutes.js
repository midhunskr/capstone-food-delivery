import express from 'express'
import { validate } from '../../middlewares/v2/validate.js'
import {
    listRestaurantsSchema, slugParamSchema, menuQuerySchema, searchSchema, offersQuerySchema,
} from '../../validators/v2/discoveryValidators.js'
import { getHome, listCuisines, listOffers, search, suggest } from '../../controllers/v2/discoveryController.js'
import { listRestaurants, getRestaurantBySlug, getRestaurantMenu } from '../../controllers/v2/restaurantController.js'

const router = express.Router()

router.get('/home', getHome)
router.get('/cuisines', listCuisines)
router.get('/offers', validate({ query: offersQuerySchema }), listOffers)

// Must be registered before '/search' so the more specific path wins.
router.get('/search/suggest', validate({ query: searchSchema }), suggest)
router.get('/search', validate({ query: searchSchema }), search)

router.get('/restaurants', validate({ query: listRestaurantsSchema }), listRestaurants)
router.get('/restaurants/:slug', validate({ params: slugParamSchema }), getRestaurantBySlug)
router.get('/restaurants/:slug/menu',
    validate({ params: slugParamSchema, query: menuQuerySchema }), getRestaurantMenu)

export default router
