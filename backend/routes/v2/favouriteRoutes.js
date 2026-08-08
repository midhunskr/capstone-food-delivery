import express from 'express'
import { authenticate } from '../../middlewares/v2/authenticate.js'
import { validate } from '../../middlewares/v2/validate.js'
import { favouriteSchema } from '../../validators/v2/orderValidators.js'
import { listFavourites, toggleFavourite } from '../../controllers/v2/favouriteController.js'

const router = express.Router()

router.use(authenticate)

router.get('/', listFavourites)
router.post('/', validate({ body: favouriteSchema }), toggleFavourite)

export default router
