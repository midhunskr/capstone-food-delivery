import express from 'express'
import { checkUser, deleteUser, getAllUsers, loginUser, registerUser, userProfile } from '../../controllers/userController.js'
import { admin, authUser } from '../../middlewares/authMiddleware.js'

const router = express.Router()

//User sign-up and sign-in
router.post('/register', registerUser)
router.post('/login', loginUser)
router.post('/profile/:id', authUser, userProfile)
router.get('/all-users', authUser, admin, getAllUsers)
router.delete('/:id', authUser, admin, deleteUser)

//Check user from Frontend
router.get('/check-user', authUser, checkUser)

export default router