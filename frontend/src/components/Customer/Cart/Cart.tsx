import { useEffect, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import axios from "axios"

import { ICart } from "../../../types/cart"


export default function Cart() {
  const navigate = useNavigate()

  const [cart, setCart] = useState<ICart>({} as ICart)
  const [totalAmount, setTotalAmount] = useState(0)
  const [totalBooks, searchBooks] = useState(0)

  async function fetchCart() {
    try {
      const response = await axios.get(`/api/customer/@me/cart/`)
      if (response.status !== 200)
        throw new Error(response.statusText)

      setCart(response.data)
    } catch (err) {
      console.error(err)
    }
  }

  useEffect(() => {
    fetchCart()
  }, [])

  return (
    <div className="customer-orders">
    <h3>Your cart has ${cart.books.length} books</h3>{
      (cart.books.length === 0)
        ? <h5><Link to='/'>Start shopping for books now.</Link></h5>
        : <div className="cart-books-list">
          {(cart.books.map((book, key) => {
            return (
              <div className="book">
                <img
                  src={`/api/static${book}`}
                  alt={book.name}
                  onClick={() => navigate(`/book/${book.id}`)}
                />

                <div className="book-details">
                  <div className="book-title">{book.name}</div>

                </div>
              </div>
            )
          }))}
        </div>
    }
    </div>
  )
}
