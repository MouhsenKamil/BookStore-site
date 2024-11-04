import express from 'express'
import {
  addBookToCart,
  deleteBookInCart,
  clearCart,
  checkout,
  getCartOfUser,
} from '../controllers/cartController.ts'

const router = express.Router()

router.get('/', getCartOfUser)
router.post('/add', addBookToCart)
router.patch('/delete', deleteBookInCart)
router.post('/checkout', checkout) 
router.delete('/clear', clearCart)

export default router
