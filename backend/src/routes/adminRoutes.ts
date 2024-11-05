import express from 'express'
import { authenticate, restrictToRoles } from '../middlewares/authMiddleware'
import { UserType } from '../models/User'
import { getSiteAnalytics } from '../controllers/adminController'


const router = express.Router()

router.use(authenticate, restrictToRoles(UserType.ADMIN))
router.get('/analytics', getSiteAnalytics)

export default router
