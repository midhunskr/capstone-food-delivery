import express from 'express'
import { authenticate } from '../../middlewares/v2/authenticate.js'
import { validate } from '../../middlewares/v2/validate.js'
import {
    createAddressSchema, updateAddressSchema, addressIdSchema,
} from '../../validators/v2/addressValidators.js'
import {
    listAddresses, createAddress, updateAddress, deleteAddress, setDefaultAddress,
} from '../../controllers/v2/addressController.js'

const router = express.Router()

// Every address route is the caller's own data.
router.use(authenticate)

router.get('/', listAddresses)
router.post('/', validate({ body: createAddressSchema }), createAddress)
router.patch('/:id', validate({ params: addressIdSchema, body: updateAddressSchema }), updateAddress)
router.delete('/:id', validate({ params: addressIdSchema }), deleteAddress)
router.post('/:id/default', validate({ params: addressIdSchema }), setDefaultAddress)

export default router
