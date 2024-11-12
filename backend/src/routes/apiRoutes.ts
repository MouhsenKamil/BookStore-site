import express, { Response} from 'express'
import path from "path"

import authRoutes from './authRoutes'
import adminRoutes from './adminRoutes'
import bookRoutes from './bookRoutes'
import sellerRoutes from './sellerRoutes'
import customerRoutes from './customerRoutes'
// import { logContactUsContent } from '../middlewares/logger'
// import { checkRequestAttrs, emailValidator } from '../middlewares/validators'


const router = express.Router()

router.use('/auth', authRoutes)
router.use('/admin', adminRoutes)
router.use('/books', bookRoutes)
router.use('/seller', sellerRoutes)
router.use('/customer', customerRoutes)

// router.post(
//   '/contact-us',
//   emailValidator,
//   checkRequestAttrs({ obj: 'body', must: ['name', 'message'] }),
//   function (req: Request, res: Response) {
//     logContactUsContent(req.body.name, req.body.email, req.body.message)
// })

// Static files endpoint
router.use(
  '/static',
  express.static(path.join(__dirname, '..', '..', 'public')),
  express.static(path.join(__dirname, '..', '..', 'db', 'static'))
)

// API entrypoint
router.get('/', (_, res: Response) => {
  res.status(200).send('Hello from express js')
})

export default router
