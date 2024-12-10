import express from 'express'
import {
  addBook,
  getBooks,
  getBookById,
  updateBook,
  deleteBook,
  purchaseBook,
  suggestCategories,
  suggestLanguages,
  suggestAuthorNames
} from '../controllers/bookController.ts'
import { authenticate, restrictToRoles } from '../middlewares/authMiddleware.ts'
import { UserType } from '../models/User.ts'
import { checkRequestAttrs, queryInParamExists } from '../middlewares/validators.ts'

import { upload } from '../config/upload.ts'


const routerWithBookId = express.Router({ mergeParams: true })

routerWithBookId.get('/', getBookById)
routerWithBookId.patch('/', authenticate, restrictToRoles(UserType.ADMIN), updateBook)
routerWithBookId.delete('/', authenticate, restrictToRoles(UserType.ADMIN), deleteBook)
routerWithBookId.post('/purchase', authenticate, restrictToRoles(UserType.CUSTOMER), purchaseBook)


const router = express.Router({ mergeParams: true })

router.put(
  '/',
  authenticate,
  restrictToRoles(UserType.ADMIN, UserType.SELLER),
  upload.single('coverImage'),
  addBook
)

// endpoints for facilitating book search
router.get('/', queryInParamExists, getBooks)
router.get('/categories', queryInParamExists, suggestCategories)
router.get('/langs', queryInParamExists, suggestLanguages)
router.get('/author-names', queryInParamExists, suggestAuthorNames)

router.use('/:bookId', checkRequestAttrs({ obj: 'params', must: ['bookId'] }), routerWithBookId)

export default router
