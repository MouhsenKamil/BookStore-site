import express, { Request, Response, } from 'express'
import authRoutes from './authRoutes'
import bookRoutes from './bookRoutes'
import sellerRoutes from './sellerRoutes'
import customerRoutes from './userRoutes'


const router = express.Router()

router.use('/auth', authRoutes)
router.use('/books', bookRoutes)
router.use('/sellers', sellerRoutes)
router.use('/users', customerRoutes)

router.get('/', (_, res: Response) => {
  res.status(200).send('Hello from express js')
})

export default router
