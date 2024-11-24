import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import axios from "axios"

import { IBookInCart } from "../../../types/cart"
import BookListItem from "../BookListItem/BookListItem"

import './Wishlist.css'


export default function Wishlist() {
  // const navigate = useNavigate()
  const [wishlistBooks, setWishlistBooks] = useState<IBookInCart[]>([])

  async function removeFromWishlist(bookId: string) {
    const response = await axios.patch("/api/customer/@me/wishlist/delete", { bookId })
    if (response.status >= 400)
      alert(response.data.error)

    else {
      setWishlistBooks(wishlistBooks.filter(book => book._id !== bookId))
      // alert('Book has been removed from wishlist successfully')
    }
  }

  async function clearWishlist() {
    const response = await axios.delete('/api/customer/@me/wishlist/clear')
    if (response.status >= 400)
      alert(response.data.error)

    else {
      setWishlistBooks([])
      // alert('Wishlist has been cleared successfully')
    }
  }

  // function BookListItem({ book }: { book: IBook }) {
  //   return (
  //     <div className="book">
  //       <img
  //         src={`/api/static${book.coverImage}`}
  //         alt={book.title}
  //         onClick={() => navigate(`/book/${book._id}`)}
  //       />

  //       <div className="book-details">
  //         <div className="book-title">{book.title}</div>
  //         <div className="price">{book.price}</div>
  //       </div>
  //     </div>
  //   )
  // }

  async function fetchWishlist() {
    const response = await axios.get(`/api/customer/@me/wishlist`)
    if (response.status >= 400)
      alert(response.data.error)
  
    else {
      console.log(response.data)
      setWishlistBooks(response.data.books)
    }
  }

  useEffect(() => {
    fetchWishlist()
  }, [])

  return (
    <div className="customer-wishlist">
    <h3>Your wishlist has {wishlistBooks.length || 0} books</h3>{
      (!wishlistBooks.length)
        ? <h5>No items in wishlist. <Link to='/'>Start shopping for books now.</Link></h5>
        : <>
        <div className="wishlist-books-list">
          {(wishlistBooks.map((book, key) => (
            <BookListItem key={key} book={book}>
              <button className="remove-from-wishlist-btn" onClick={() => {
                removeFromWishlist(book._id as string)
              }}>
                Remove from Wishlist
              </button>
            </BookListItem>
          )))}
        </div>
        <button onClick={clearWishlist}>Clear Wishlist</button>
      </>
    }
    </div>
  )
}
