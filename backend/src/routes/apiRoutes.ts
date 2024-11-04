import express, { Response } from 'express'
import path from "path"

import authRoutes from './authRoutes'
import bookRoutes from './bookRoutes'
import sellerRoutes from './sellerRoutes'
import customerRoutes from './userRoutes'


const router = express.Router()

router.use('/auth', authRoutes)
router.use('/books', bookRoutes)
router.use('/sellers', sellerRoutes)
router.use('/users', customerRoutes)


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
