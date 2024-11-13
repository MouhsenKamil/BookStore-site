import express from 'express'

import { register, login, logout, refresh, verify, changePassword } from '../controllers/authController.ts'
import { rateLimiter } from '../middlewares/rateLimiter.ts'
import { IsAuthenticated } from '../middlewares/authMiddleware.ts'
import { checkRequestAttrs, emailPasswordValidators } from '../middlewares/validators.ts'


const router = express.Router()
const ONE_MINUTE = 60 * 1000

const redirectToHomeIfAuthenticated = IsAuthenticated({
  yes: { redirectTo: '/' },
})

const redirectToLoginIfNotAuthenticated = IsAuthenticated({
  no: { redirectTo: '/account/user/login' },
})


router.post(
  '/register',
  redirectToHomeIfAuthenticated,
  rateLimiter(
    'Too many register attempts from this IP, please try again after a minute',
    ONE_MINUTE,
  ),
  ...emailPasswordValidators,
  checkRequestAttrs({obj: 'body', must: ['name', 'type']}),
  register
)

router.get(
  '/refresh',
  redirectToLoginIfNotAuthenticated,
  rateLimiter(
    'Too many requests from this IP, please try again after a minute',
    ONE_MINUTE,
  ),
  refresh
)

router.get('/verify', redirectToLoginIfNotAuthenticated, verify)

router.post('/logout', redirectToLoginIfNotAuthenticated, logout)

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

router.post(
  '/change-password',
  redirectToLoginIfNotAuthenticated,
  rateLimiter(
    'Too many changes from this IP, please try again after a minute',
    ONE_MINUTE,
  ),
  changePassword
)

export default router
