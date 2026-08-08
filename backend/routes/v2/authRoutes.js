import express from 'express'
import { login, logout, me, register } from '../../controllers/v2/authController.js'
import { validate } from '../../middlewares/v2/validate.js'
import { authenticate } from '../../middlewares/v2/authenticate.js'
import { authLimiter } from '../../middlewares/v2/rateLimiters.js'
import { loginSchema, registerSchema } from '../../validators/v2/authValidators.js'

const router = express.Router()

router.post('/register', authLimiter, validate({ body: registerSchema }), register)
router.post('/login', authLimiter, validate({ body: loginSchema }), login)
router.post('/logout', logout)
router.get('/me', authenticate, me)

export default router
