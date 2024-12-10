import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import axios from "axios"

import {
  addBookToCartAPI,
  clearCartAPI,
  getCartOfUserAPI,
  removeBookFromCartAPI
} from "../services/cartServices"
import { IBookInCart } from "../types/cart"
import { useAuth } from "./useAuth"



export default function useCart(props?: { userId?: string }) {
  const { userId = "@me" } = props || {}
  const { user } = useAuth().authState
  const navigate = useNavigate()

  const [cart, setCart] = useState<IBookInCart[]>([])

  if (!user)
    throw new Error("User type not found")

  if (user.type !== 'customer')
    throw new Error(`Unknown user type: ${user.type}`)

  useEffect(() => {
    getCartOfUserAPI({ userId })
      .then(response => setCart(response.data))
  }, [])


  async function addBookToCart(bookId: string, options?: { quantity?: number }) {
    await addBookToCartAPI(bookId, {quantity: options?.quantity, userId})

    const bookRes = await axios.get('/api/books/' + bookId)

    setCart([...cart, {
      _id: bookRes.data._id,
      title: bookRes.data.title,
      price: bookRes.data.price,
      unitsInStock: bookRes.data.unitsInStock,
      coverImage: bookRes.data.coverImage,
      quantity: bookRes.data.quantity,
    }])

    alert("Book has been added to cart successfully")
  }

  async function getCartOfUser() {
    return cart
  }

  async function removeBookFromCart(bookId: string) {
    await removeBookFromCartAPI(bookId, {userId})
    setCart(cart.filter(book => book._id !== bookId))
    alert("Book has been removed to cart successfully")
  }

  async function checkoutCart() {
    // setCart([])
    navigate('/user/checkout?method=cart')
    // await checkoutAPI({ userId })
  }

  async function clearCart() {
    await clearCartAPI({ userId })
    setCart([])
    alert("Cart has been cleared successfully")
  }

  return { cart, addBookToCart, getCartOfUser, removeBookFromCart, checkoutCart, clearCart }
}
