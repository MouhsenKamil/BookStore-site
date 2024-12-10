import { Link } from "react-router-dom"

import BookListItem from "../../Common/BookListItem/BookListItem"
import useWishlist from "../../../hooks/useWishlist"
import { AddtoCartButton } from "../../Common/CommonButtons"

import './Wishlist.css'


export default function Wishlist() {
  const { wishlist, clearWishlist, removeBookFromWishlist } = useWishlist()

  return (
    <div className="customer-wishlist">
    <h3>Your wishlist has {wishlist.length} books</h3>{
      (!wishlist.length)
        ? <h5>No items in wishlist. <Link to='/'>Start shopping for books now.</Link></h5>
        : <>
        <div className="wishlist-books-list">
          {(wishlist.map((book, key) => (
            <BookListItem key={key} book={book}>
              <button onClick={async (e) => {
                const target = e.currentTarget ?? e.target
                try {
                  await removeBookFromWishlist(book._id)
                  target.inputMode = "Removed from Wishlist ✅"
                } catch {
                  target.inputMode = "Error Occurred ❗"
                }

                setTimeout(() => {
                  target.innerText = "Remove from Wishlist"
                }, 2500)
              }}>Remove from Wishlist</button>
              <AddtoCartButton bookId={book._id} />
            </BookListItem>
          )))}
        </div>
        <button onClick={clearWishlist}>Clear Wishlist</button>
      </>
    }
    </div>
  )
}
