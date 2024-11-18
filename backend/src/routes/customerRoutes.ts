import express from 'express'
import {
  deleteCustomer,
  getCustomerById,
  updateCustomer,
  blockCustomer,
  unblockCustomer,
  addCreditCard,
  deleteCreditCard,
} from '../controllers/customerController.ts'

import cartRoutes from './cartRoutes.ts'
import orderRoutes from './orderRoutes.ts'
import wishListRoutes from './wishlistRoutes.ts'
import { authenticate, restrictToRoles } from '../middlewares/authMiddleware.ts'
import { UserType } from '../models/User.ts'
import { checkRequestAttrs, restrictEditingSensibleInfo } from '../middlewares/validators.ts'
import { verifyUserIdParamByUserAuth } from '../middlewares/userMiddleware.ts'


const routerWithUserId = express.Router({ mergeParams: true })

routerWithUserId.use(
  checkRequestAttrs({ obj: 'params', must: ['userId'] }),
  // parseMeInParams('userId'),
  verifyUserIdParamByUserAuth('userId')
)

routerWithUserId.use('/order', orderRoutes)
routerWithUserId.use('/cart', cartRoutes)
routerWithUserId.use('/wishlist', wishListRoutes)

routerWithUserId.get('/', getCustomerById)
routerWithUserId.patch('/', restrictEditingSensibleInfo, updateCustomer)


// routes for credit card
routerWithUserId.post(
  '/card',
  checkRequestAttrs({
    obj: 'body', must: ['cardNumber', 'cardHolderName', 'expiryDate', 'cvv']
  }),
  addCreditCard
)

routerWithUserId.delete(
  '/card/:cardId',
  checkRequestAttrs({ obj: 'params', must: ['cardId'] }),
  deleteCreditCard
)

// routerWithUserId.patch(
//   '/change-password',
//   changeUserPassword
// )
// routerWithUserId.patch('/become-a-seller', becomeSeller)


// admin only route
const adminRoutesWithUserId = express.Router({ mergeParams: true })

adminRoutesWithUserId.use(restrictToRoles(UserType.ADMIN))
adminRoutesWithUserId.patch('/block', blockCustomer)
adminRoutesWithUserId.patch('/unblock', unblockCustomer)
adminRoutesWithUserId.delete('/', deleteCustomer)

routerWithUserId.use(adminRoutesWithUserId)


// exporting routes
const router = express.Router({mergeParams: true})

router.use(authenticate, restrictToRoles(UserType.ADMIN, UserType.CUSTOMER))
router.use('/:userId', routerWithUserId)

// router.post(
//   '/',
//   rateLimiter(
//     'Too many register attempts from this IP, please try again after a minute',
//     ONE_MINUTE,
//   ),
//   checkRequestAttrs({ obj: 'body', mustNot: ['type'] }),
//   createUser
// )


export default router
