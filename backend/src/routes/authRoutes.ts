import express from 'express'
import { register, login, logout, refresh } from '../controllers/authController.ts'
import { rateLimiter } from '../middlewares/rateLimiter.ts'
import { authenticate } from '../middlewares/authMiddleware.ts'
import { emailPasswordValidators, nameInBodyExists } from '../middlewares/validators.ts'


const router = express.Router()

router.post(
  '/register',
  rateLimiter(
    'Too many register attempts from this IP, please try again after a minute',
    60 * 1000, // 1 minute
  ),
  nameInBodyExists,
  ...emailPasswordValidators,
  register
)

router.get(
  '/refresh',
  rateLimiter(
    'Too many requests from this IP, please try again after a minute',
    60 * 1000, // 1 minute
  ),
  refresh
)

router.post('/logout', authenticate, logout)
router.post(
  '/login',
  rateLimiter(
    'Too many login attempts from this IP, please try again after a minute',
    60 * 1000, // 1 minute
  ),
  ...emailPasswordValidators,
  login
)


export default router
