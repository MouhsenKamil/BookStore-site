import { useState } from 'react'

const useCart = () => {
  const [cart, setCart] = useState<any[]>([])

  const addToCart = (book: any) => {
    setCart((prevCart) => [...prevCart, book])
  }

  const removeFromCart = (id: string) => {
    setCart((prevCart) => prevCart.filter(book => book._id !== id))
  }

  const clearCart = () => {
    setCart([])
  }

  return {
    cart,
    addToCart,
    removeFromCart,
    clearCart,
  }
}

export default useCart
