import express from 'express'
import {
  createUser,
  changePassword,
  deleteUser,
  getUserById,
  updateUser,
  blockUser,
  unblockUser,
  becomeSeller,
  getUsers,
} from '../controllers/userController.ts'

import cartRoutes from './cartRoutes.ts'
import orderRoutes from './orderRoutes.ts'
import wishListRoutes from './wishlistRoutes.ts'
import { authenticate, restrictToRoles } from '../middlewares/authMiddleware.ts'
import { UserType } from '../models/User.ts'
import { checkRequestAttrs, queryInParamExists } from '../middlewares/validators.ts'
import { parseMeInParams, verifyUserIdParamByUserAuth } from '../middlewares/userMiddleware.ts'


const routerWithUserId = express.Router()

routerWithUserId.use(
  checkRequestAttrs({ obj: 'params', must: ['userId'] }),
  parseMeInParams('userId'),
  verifyUserIdParamByUserAuth('userId')
)

routerWithUserId.use('/order', orderRoutes)
routerWithUserId.use('/cart', cartRoutes)
routerWithUserId.use('/wishlist', wishListRoutes)

routerWithUserId.get('/', getUserById)
routerWithUserId.patch(
  '/',
  checkRequestAttrs({ obj: 'body', mustNot: ['email', 'passwordHash', 'type'] }),
  updateUser
)
routerWithUserId.patch('/change-password', changePassword)
routerWithUserId.patch('/become-a-seller', becomeSeller)


// admin only route
const adminRoutesWithUserId = express.Router()

adminRoutesWithUserId.use(restrictToRoles(UserType.ADMIN))
adminRoutesWithUserId.patch('/block', blockUser)
adminRoutesWithUserId.patch('/unblock', unblockUser)
adminRoutesWithUserId.delete('/', deleteUser)

routerWithUserId.use(adminRoutesWithUserId)


// exporting routes
const router = express.Router()

router.use(authenticate, restrictToRoles(UserType.ADMIN, UserType.CUSTOMER))
router.use('/:userId', routerWithUserId)

router.get('/', restrictToRoles(UserType.ADMIN), queryInParamExists, getUsers)
router.post('/', checkRequestAttrs({ obj: 'body', mustNot: ['type'] }), createUser)


export default router
