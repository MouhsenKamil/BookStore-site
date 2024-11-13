import { useEffect, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import axios from "axios"

import { IBookInCart } from "../../../types/cart"


export default function Cart() {
  const navigate = useNavigate()
  const [cartBooks, setCartBooks] = useState<IBookInCart[]>([])
  const [bookAndQuantities, setBookAndQuantities] = useState<{[key: string]: number}>({})

  async function removeFromCart(bookId: string) {
    try {
      const response = await axios.patch("/api/customer/@me/cart/delete", { bookId })
      if (response.status !== 204)
        alert(response.status)
      else {
        setCartBooks(cartBooks.filter(book => book._id !== bookId))
        let tempBookAndQuantities = {...bookAndQuantities}
        delete tempBookAndQuantities[bookId]
        setBookAndQuantities(tempBookAndQuantities)
      }
    } catch (error) {
      console.error(error)
    }
  }

  async function checkout() {
    navigate(`/checkout?method=cart`)
  }

  async function clearCart() {
    try {
      const response = await axios.delete('/api/customer/@me/cart/clear')
    } catch (err) {

    }
  }

  function BookListItem({ book }: { book: IBookInCart }) {
    const [quantity, setQuantity] = useState(1)

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
            defaultValue={1} onChange={e => {
              setQuantity(parseInt(e.target.value))
              setBookAndQuantities({ ...bookAndQuantities, [book._id]: quantity })
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
