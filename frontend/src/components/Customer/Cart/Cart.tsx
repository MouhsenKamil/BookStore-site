import { useEffect, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import axios from "axios"

import { IBookInCart } from "../../../types/cart"
import CoverImage from "../../Common/CoverImage/CoverImage"


export default function Cart() {
  const navigate = useNavigate()
  const [cartBooks, setCartBooks] = useState<IBookInCart[]>([])

  async function removeFromCart(bookId: string) {
    const response = await axios.patch(
      "/api/customer/@me/cart/delete", { bookId }, { withCredentials: true }
    )

    if (response.status >= 400)
      alert(response.data.error)

    else
      setCartBooks(cartBooks.filter(book => book._id !== bookId))
  }

  async function checkout() {
    // const response = await axios.post('/api/customer/@me/cart', {
    //   books: cartBooks.forEach(book => {
    //     return { id: book._id, quantity: book.quantity }
    //   })
    // }, { withCredentials: true })

    // if (response.status >= 400)
    //   alert(response.data.error)

    // else
    navigate(`/user/checkout?method=cart`)
  }

  async function clearCart() {
    const response = await axios.delete(
      '/api/customer/@me/cart/clear', { withCredentials: true }
    )

    if (response.status >= 400)
      alert(response.data.error)

    else
      setCartBooks([])
  }

  function BookListItem({ book }: { book: IBookInCart }) {
    return (
      <div className="book">
        <CoverImage
          coverImg={book.coverImage}
          alt={book.title}
          onClick={() => navigate(`/book/${book._id}`)}
        />

        <div className="book-details">
          <div className="book-title">{book.title}</div>
          <div className="price">₹ {book.price}</div>
          <div className="quantity">Quantity: {book.quantity || 1}</div>
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
    const response = await axios.get(`/api/customer/@me/cart`, { withCredentials: true })
    if (response.status >= 400)
      alert(response.data.error)

    else
      setCartBooks(response.data.books)
  }

  useEffect(() => {
    fetchCart()
  }, [])

  return (
    <div className="customer-cart">
      <h3>Your cart has {(cartBooks ?? []).length} books</h3>{
        ((cartBooks ?? []).length === 0)
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
