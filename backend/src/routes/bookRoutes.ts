import express from 'express'
import {
  addBook,
  getBooks,
  getBookById,
  updateBook,
  deleteBook
} from '../controllers/bookController.ts'
import { authenticate, restrictToRoles } from '../middlewares/authMiddleware.ts'
import { UserType } from '../models/User.ts'
import { checkRequestAttrs, queryInParamExists } from '../middlewares/validators.ts'


const router = express.Router()

const bookidParamChecker = checkRequestAttrs({obj: 'params', must: ['bookid']})


router.put(
  '/',
  authenticate,
  restrictToRoles(UserType.ADMIN, UserType.SELLER),
  addBook
)

router.get('/', queryInParamExists, getBooks)
router.get('/:bookid', bookidParamChecker, getBookById)
router.patch(
  '/:bookid',
  authenticate,
  restrictToRoles(UserType.ADMIN),
  bookidParamChecker,
  updateBook
)
router.delete(
  '/:bookid',
  authenticate,
  restrictToRoles(UserType.ADMIN),
  bookidParamChecker,
  deleteBook
)

export default router
