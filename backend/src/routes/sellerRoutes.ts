import express from 'express'
import {
  getSalesAnalytics,
  // createSeller,
  // getSellers,
  // getSellerById,
  // updateSeller,
  // deleteSeller,
  // blockSeller,
  // unblockSeller,
  // changePassword,
  registerBook,
} from '../controllers/sellerController.ts'
import { checkRequestAttrs } from '../middlewares/validators.ts'
import { authenticate, restrictToRoles } from '../middlewares/authMiddleware.ts'
import { UserType } from '../models/User.ts'
import { parseMeInParams, verifyUserIdParamByUserAuth } from '../middlewares/userMiddleware.ts'


const routerWithSellerId = express.Router()

routerWithSellerId.use(
  checkRequestAttrs({ obj: 'params', must: ['sellerId'] }),
  parseMeInParams('sellerId'),
  verifyUserIdParamByUserAuth('sellerId')
)
// routerWithSellerId.get('/', getSellerById)
// routerWithSellerId.patch(
//   '/', checkRequestAttrs({ obj: 'body', mustNot: ['type', 'password_hash'] }), updateSeller
// )
// routerWithSellerId.delete('/', deleteSeller)
routerWithSellerId.post('/add-book', registerBook)
routerWithSellerId.get('/analytics', getSalesAnalytics)
// routerWithSellerId.patch('/change-password', changePassword)


// admin only route
// const adminRoutesWithSellerId = express.Router()

// adminRoutesWithSellerId.use(restrictToRoles(UserType.ADMIN))
// adminRoutesWithSellerId.patch('/block', blockSeller)
// adminRoutesWithSellerId.patch('/unblock', unblockSeller)

// export routes
const router = express.Router()

router.use(authenticate, restrictToRoles(UserType.SELLER, UserType.ADMIN))
router.use('/:sellerId', routerWithSellerId)

// router.get('/', restrictToRoles(UserType.ADMIN), queryInParamExists, getSellers)
// router.post('/', checkRequestAttrs({ obj: 'body', mustNot: ['type'] }), createSeller)


export default router
