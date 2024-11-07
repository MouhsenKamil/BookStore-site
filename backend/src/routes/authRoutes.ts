import express from 'express'
import { register, login, logout, refresh, verify } from '../controllers/authController.ts'
import { rateLimiter } from '../middlewares/rateLimiter.ts'
import { IsAuthenticated } from '../middlewares/authMiddleware.ts'
import { emailPasswordValidators, nameInBodyExists } from '../middlewares/validators.ts'


const router = express.Router()
const ONE_MINUTE = 60 * 1000

const redirectToHomeIfAuthenticated = IsAuthenticated({
  yes: { redirectTo: '/home' },
})

const redirectToLoginIfNotAuthenticated = IsAuthenticated({
  no: { redirectTo: '/login' },
})


router.post(
  '/register',
  redirectToHomeIfAuthenticated,
  rateLimiter(
    'Too many register attempts from this IP, please try again after a minute',
    ONE_MINUTE,
  ),
  ...emailPasswordValidators,
  nameInBodyExists,
  register
)

router.get(
  '/refresh',
  // authenticate,
  redirectToLoginIfNotAuthenticated,
  rateLimiter(
    'Too many requests from this IP, please try again after a minute',
    ONE_MINUTE,
  ),
  refresh
)

router.get(
  '/verify',
  redirectToLoginIfNotAuthenticated,
  verify
)

router.post(
  '/logout',
  // authenticate,
  redirectToLoginIfNotAuthenticated,
  logout
)

router.post(
  '/login',
  redirectToHomeIfAuthenticated,
  rateLimiter(
    'Too many login attempts from this IP, please try again after a minute',
    ONE_MINUTE,
  ),
  ...emailPasswordValidators,
  login
)


export default router
