import express, { Response} from 'express'
import path from "path"

import authRoutes from './authRoutes'
import adminRoutes from './adminRoutes'
import bookRoutes from './bookRoutes'
import sellerRoutes from './sellerRoutes'
import customerRoutes from './customerRoutes'


const router = express.Router({mergeParams: true})

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
  express.static(path.join(__dirname, '..', '..', 'db', 'static'), { maxAge: '1h' }),
  express.static(path.join(__dirname, '..', '..', 'public'), { maxAge: '1h' })
)

// API entrypoint
router.get('/', (_, res: Response) => {
  res.status(200).send('Hello from express js')
})

export default router
