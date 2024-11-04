import express from 'express'
import {
  addBookToWishlist,
  deleteBookInWishlist,
  getWishlistOfUser,
  clearWishlist
} from '../controllers/wishlistController.ts'
import { checkRequestAttrs } from '../middlewares/validators.ts'


const router = express.Router()

const bodyBookIdCheck = checkRequestAttrs({obj: 'body', must: ['bookId']})

router.get('/', getWishlistOfUser)
router.patch('/add', bodyBookIdCheck, addBookToWishlist)
router.patch('/delete', bodyBookIdCheck, deleteBookInWishlist)
router.delete('/clear', clearWishlist)


export default router
