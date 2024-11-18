import { MouseEvent } from "react"
import { useNavigate } from "react-router-dom"
import axios from "axios"

import { IBookWithSellerName } from "../../types/book"
import CoverImage from "../CoverImage/CoverImage"

import './BookCard.css'


export default function BookCard(props: { book: IBookWithSellerName }) {
  const { book } = props
  const navigate = useNavigate()

  function goToBookPage() {
    navigate(`/book/${book._id}`)
  }

  const onAddToWishlist = async (_: MouseEvent<HTMLButtonElement>) => {
    const response = await axios.post(
      '/api/customer/@me/wishlist/add', { bookId: book._id }, { withCredentials: true }
    )

    let messsage = (response.status === 201)
      ? 'Book is now added to the wishlist' : response.data.error

    alert(messsage)
  }

  const onAddToCart = async (_: MouseEvent<HTMLButtonElement>) => {
    const response = await axios.post(
      '/api/customer/@me/cart/add', { bookId: book._id, quantity: 1 }, { withCredentials: true }
    )

    let messsage = (response.status === 201 || response.status === 204)
      ? 'Book is now added to the cart' : response.data.error

    alert(messsage)
  }

  return (
    <div className="book-card">
      <div className="image-container">
        <CoverImage coverImg={book.coverImage} alt={book.title} onClick={goToBookPage} />
        <div className="book-details">
          <div className="book-title" onClick={goToBookPage} title={book.title}>
            {book.title}
          </div>
          {book.price && <b style={{ color: 'orange' }}>₹ {book.price.toFixed(2)}</b>}
          {book.unitsInStock && <span>
            <span style={{color: '#15dd15'}}>In Stock: </span>
            {book.unitsInStock}</span>
          }
          <div className="book-actions">
            <button title="Add to Wishlist" onClick={onAddToWishlist}>Add to Wishlist ⭐</button>
            <button title="Add to Cart" onClick={onAddToCart}>Add to Cart 🛒</button>
          </div>
        </div>
      </div>
    </div>
  )
}
