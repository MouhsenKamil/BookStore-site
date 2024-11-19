import { IBookInCart } from "../types/cart"
import { useState } from "react"

import {
  addBookToCart, getCartOfUser, removeBookFromCart, checkout, clearCart
} from "../services/cartServices"


export default function useCart() {
  const [cart, setCart] = useState<IBookInCart[]>([])

  return { cart, addBookToCart, getCartOfUser, removeBookFromCart, checkout, clearCart }
}
