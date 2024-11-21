 import { IBookInCart } from "../types/cart"
import { useEffect, useState } from "react"

import {
  addBookToCartAPI, checkoutAPI, clearCartAPI, getCartOfUserAPI, removeBookFromCartAPI
} from "../services/cartServices"
import { useAuth } from "./useAuth"
import axios from "axios"


interface useCartProps {
  userId: string
  keepList: boolean
}


export default function useCart(props: useCartProps) {
  const { userId = '@me', keepList = false } = props
  const { user } = useAuth().authState
  const [cart, setCart] = useState<IBookInCart[]>([])

  if (!user)
    throw new Error("User type not found")

  if (user.type !== 'customer')
    throw new Error(`Unknown user type: ${user.type}`)

  useEffect(() => {
    getCartOfUserAPI({userId})
      .then(response => {
        if (response.status >= 400)
          alert(response.data.error)
        else if (keepList)
          setCart(response.data)
      })
  })


  async function addBookToCart(
    bookId: string, options?: { quantity?: number }
  ) {
    const response = await addBookToCartAPI(bookId, {
      quantity: options?.quantity, userId
    })

    if (response.status >= 400)
      alert(response.data.error)

    else {
      const bookRes = await axios.get('/api/books/' + bookId)

      if (response.status >= 400) {
        alert(response.data.error)
        return
      }

      if (keepList)
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
  }


  async function getCartOfUser() {
    // const response = await getCartOfUserAPI({userId})

    // if (response.status >= 400)
    //   alert(response.data.error)

    // else
    return cart
  }

  async function removeBookFromCart(bookId: string) {
    const response = await removeBookFromCartAPI(bookId, {userId})

    if (response.status >= 400)
      alert(response.data.error)

    else {
      if (keepList)
        setCart(cart.filter(book => book._id === bookId))
      alert("Book has been removed to cart successfully")
    }
  }

  async function checkout() {
    const response = await checkoutAPI({ userId })
    if (response.status >= 400)
      alert(response.data.error)

    else
      setCart([])
  }

  async function clearCart() {
    const response = await clearCartAPI({ userId })

    if (response.status >= 400)
      alert(response.data.error)

    else {
      if (keepList)
        setCart([])
      alert("Cart has been cleared successfully")
    }
  }


  return { cart, addBookToCart, getCartOfUser, removeBookFromCart, checkout, clearCart }
}
