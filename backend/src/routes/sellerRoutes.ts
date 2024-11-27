import express from 'express'
import {
  // createSeller,
  deleteSeller,
  getSalesAnalytics,
  // getSellers,
  getSellerById,
  registerBook,
  updateSeller,
  blockSeller,
  unblockSeller,
} from '../controllers/sellerController.ts'
import { checkRequestAttrs, restrictEditingSensibleInfo } from '../middlewares/validators.ts'
import { authenticate, restrictToRoles } from '../middlewares/authMiddleware.ts'
import { verifyUserIdParamByUserAuth } from '../middlewares/userMiddleware.ts'

import { UserType } from '../models/User.ts'
import { upload } from '../config/upload.ts'


const routerWithSellerId = express.Router({ mergeParams: true })

routerWithSellerId.use(
  checkRequestAttrs({ obj: 'params', must: ['sellerId'] }),
  // parseMeInParams('sellerId'),
  verifyUserIdParamByUserAuth('sellerId')
)

routerWithSellerId.get('/', getSellerById)
routerWithSellerId.patch('/', restrictEditingSensibleInfo, updateSeller)
routerWithSellerId.delete('/', deleteSeller)


routerWithSellerId.put('/add-book', upload.single('coverImage'), registerBook)
routerWithSellerId.get('/analytics', getSalesAnalytics)
// routerWithSellerId.patch('/change-password', changePassword)


// admin only route
const adminRoutesWithSellerId = express.Router({ mergeParams: true })

adminRoutesWithSellerId.use(restrictToRoles(UserType.ADMIN))
adminRoutesWithSellerId.patch('/block', blockSeller)
adminRoutesWithSellerId.patch('/unblock', unblockSeller)

// export routes
const router = express.Router({mergeParams: true})

router.use(authenticate, restrictToRoles(UserType.SELLER, UserType.ADMIN))
router.use('/:sellerId', routerWithSellerId)

// router.post(
//   '/',
//   rateLimiter(
//     'Too many register attempts from this IP, please try again after a minute',
//     ONE_MINUTE,
//   ),
//   checkRequestAttrs({ obj: 'body', mustNot: ['type'] }),
//   createSeller
// )


export default router
