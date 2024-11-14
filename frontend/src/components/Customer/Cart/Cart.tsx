import { useEffect, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import axios from "axios"

import { IBookInCart } from "../../../types/cart"


export default function Cart() {
  const navigate = useNavigate()
  const [cartBooks, setCartBooks] = useState<IBookInCart[]>([])

  async function removeFromCart(bookId: string) {
    try {
      const response = await axios.patch("/api/customer/@me/cart/delete", { bookId })
      if (response.status !== 204)
        throw new Error(response.data.error)

      setCartBooks(cartBooks.filter(book => book._id !== bookId))
    } catch (error) {
      console.error(error)
    }
  }

  async function checkout() {
    try {
      const response = await axios.post("/api/customer/@me/cart", {
        books: cartBooks.forEach(book => {
          return { id: book._id, quantity: book.quantity }
        })
      })

      if (response.status !== 204)
        throw new Error(response.data.error)

      navigate(`/user/checkout?method=cart`)
    } catch (err) {
      console.error(err)
    }
  }

  async function clearCart() {
    try {
      const response = await axios.delete('/api/customer/@me/cart/clear')
      if (response.status !== 204)
        throw new Error(response.data.error)

      setCartBooks([])
    } catch (err) {
      console.error(err)
    }
  }

  function BookListItem({ book }: { book: IBookInCart }) {
    return (
      <div className="book">
        <img
          src={`/api/static${book.coverImage}`}
          alt={book.title}
          onClick={() => navigate(`/book/${book._id}`)}
        />

        <div className="book-details">
          <div className="book-title">{book.title}</div>
          <div className="price">{book.price}</div>
          <input
            type="number" name="quantity" id="quantity" min={0} max={book.unitsInStock}
            value={book.quantity} onChange={e => {
              book.quantity = +e.target.value
              setCartBooks([...cartBooks.filter(_book => _book._id !== book._id), book])
            }}
          />
          <button className="remove-from-cart-btn" onClick={() => {
            removeFromCart(book._id)
          }}>
            Remove from Cart
          </button>
        </div>
      </div>
    )
  }

  async function fetchCart() {
    try {
      const response = await axios.get(`/api/customer/@me/cart`)
      if (response.status !== 200)
        throw new Error(response.data.error)
      setCartBooks(response.data.books)
    } catch (err) {
      console.error(err)
    }
  }

  useEffect(() => {
    fetchCart()
  }, [])

  return (
    <div className="customer-orders">
    <h3>Your cart has ${cartBooks.length} books</h3>{
      (cartBooks.length === 0)
        ? <h5>No items in cart. <Link to='/'>Start shopping for books now.</Link></h5>
        : <>
        <div className="cart-books-list">
          {(cartBooks.map((book, key) => <BookListItem key={key} book={book} />))}
        </div>
        <button onClick={clearCart}>Clear Cart</button>
        <button onClick={checkout}>Checkout</button>
      </>
    }
    </div>
  )
}
