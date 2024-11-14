import express from 'express'
import { authenticate, restrictToRoles } from '../middlewares/authMiddleware'
import { UserType } from '../models/User'
import { getSiteAnalytics } from '../controllers/adminController'
import { queryInParamExists } from '../middlewares/validators'
import { getCustomers } from '../controllers/customerController'
import { getSellers } from '../controllers/sellerController'


const router = express.Router()

router.use(authenticate, restrictToRoles(UserType.ADMIN))
router.get('/analytics', getSiteAnalytics)

router.get('/customers', queryInParamExists, getCustomers)

router.get('/sellers', queryInParamExists, getSellers)


export default router
