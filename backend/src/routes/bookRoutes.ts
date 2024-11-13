import express from 'express'
import {
  addBook,
  getBooks,
  getBookById,
  updateBook,
  deleteBook,
  purchaseBook
} from '../controllers/bookController.ts'
import { authenticate, restrictToRoles } from '../middlewares/authMiddleware.ts'
import { UserType } from '../models/User.ts'
import { checkRequestAttrs, queryInParamExists } from '../middlewares/validators.ts'


const routerWithBookId = express.Router({ mergeParams: true })


routerWithBookId.get('/', getBookById)
routerWithBookId.patch(
  '/',
  authenticate,
  restrictToRoles(UserType.ADMIN),
  updateBook
)
routerWithBookId.delete(
  '/',
  authenticate,
  restrictToRoles(UserType.ADMIN),
  deleteBook
)
routerWithBookId.post(
  '/purchase',
  authenticate,
  restrictToRoles(UserType.CUSTOMER),
  purchaseBook
)


const router = express.Router()

router.put(
  '/',
  authenticate,
  restrictToRoles(UserType.ADMIN, UserType.SELLER),
  addBook
)
router.get(
  '/',
  queryInParamExists,
  getBooks
)

router.use(
  '/:bookId',
  checkRequestAttrs({ obj: 'params', must: ['bookId'] }),
  routerWithBookId
)

export default router
