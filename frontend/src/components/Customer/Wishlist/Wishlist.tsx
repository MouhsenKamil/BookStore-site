import { useEffect, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import axios from "axios"

import { IBook } from "../../../types/book"


export default function Wishlist() {
  const navigate = useNavigate()
  const [wishlistBooks, setWishlistBooks] = useState<IBook[]>([])

  async function removeFromWishlist(bookId: string) {
    try {
      const response = await axios.patch("/api/customer/@me/wishlist/delete", { bookId })
      if (response.status !== 204)
        throw new Error(response.data.error)

      setWishlistBooks(wishlistBooks.filter(book => book._id !== bookId))
    } catch (error) {
      console.error(error)
    }
  }

  async function clearWishlist() {
    try {
      const response = await axios.delete('/api/customer/@me/wishlist/clear')
      if (response.status !== 204)
        throw new Error(response.data.error)

      setWishlistBooks([])
    } catch (err) {
      console.error(err)
    }
  }

  function BookListItem({ book }: { book: IBook }) {
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
          <button className="remove-from-wishlist-btn" onClick={() => {
            removeFromWishlist(book._id as string)
          }}>
            Remove from Wishlist
          </button>
        </div>
      </div>
    )
  }

  async function fetchWishlist() {
    try {
      const response = await axios.get(`/api/customer/@me/wishlist`)
      if (response.status !== 200)
        throw new Error(response.data.error)
      setWishlistBooks(response.data.books)
    } catch (err) {
      console.error(err)
    }
  }

  useEffect(() => {
    fetchWishlist()
  }, [])

  return (
    <div className="customer-orders">
    <h3>Your wishlist has ${wishlistBooks.length} books</h3>{
      (!wishlistBooks.length)
        ? <h5>No items in wishlist. <Link to='/'>Start shopping for books now.</Link></h5>
        : <>
        <div className="wishlist-books-list">
          {(wishlistBooks.map((book, key) => <BookListItem key={key} book={book} />))}
        </div>
        <button onClick={clearWishlist}>Clear Wishlist</button>
      </>
    }
    </div>
  )
}
