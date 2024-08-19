import express from 'express'
import { checkUser, loginUser, registerUser, userProfile } from '../../controllers/userController.js'
import { authUser } from '../../middlewares/authMiddleware.js'

const router = express.Router()

//Local sign-up and sign-in
router.post('/register', registerUser)
router.post('/login', loginUser)
router.post('/profile/:id', authUser, userProfile)

//Check user from Frontend
router.get('/check-user', authUser, checkUser)

export default router