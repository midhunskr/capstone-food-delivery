import express from 'express'
import { upload } from '../../middlewares/uploadMiddleware.js'
import { admin, authUser } from '../../middlewares/authMiddleware.js'
import { createMenuItem, deleteMenuItem, getMenuItems, menuItemById, updateMenuItem } from '../../controllers/menuItemController.js'

const router = express.Router()

router.post('/create/:restaurantId', authUser, admin, upload.single('image'), createMenuItem)
router.get('/all-items/:restaurantId', authUser, getMenuItems)
router.get('/item/:id', authUser, menuItemById)
router.put('/item/:id', authUser, admin, upload.single('image'), updateMenuItem)
router.delete('/item/:id', authUser, admin, deleteMenuItem)

export default router