import express from 'express'
import {
  addBookToCart,
  deleteBookInCart,
  clearCart,
  checkout,
  getCartOfUser,
  updatedCart,
} from '../controllers/cartController.ts'
import { checkRequestAttrs } from '../middlewares/validators.ts'


const router = express.Router({mergeParams: true})

router.get('/', getCartOfUser)
router.post('/add', checkRequestAttrs({ obj: 'body', must: ['bookId', 'quantity'] }), addBookToCart)
router.patch('/update', updatedCart)
router.patch('/delete', checkRequestAttrs({ obj: 'body', must: ['bookId'] }), deleteBookInCart)

router.post('/checkout', checkout)
router.delete('/clear', clearCart)

export default router
