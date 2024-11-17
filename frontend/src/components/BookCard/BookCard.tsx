import { MouseEvent } from "react"
import { useNavigate } from "react-router-dom"
import axios from "axios"

import { IBookWithSellerName } from "../../types/book"

import './BookCard.css'
import CoverImage from "../CoverImage/CoverImage"


export default function BookCard(props: { book: IBookWithSellerName }) {
  const { book } = props
  const navigate = useNavigate()

  function goToBookPage() {
    navigate(`/book/${book._id}`)
  }

  const onAddToWishlist = async (_: MouseEvent<HTMLButtonElement>) => {
    const response = await axios.post('/api/customers/@me/wishlist/add', { bookId: book._id })

    let messsage = (response.status === 201)
      ? 'Book is now added to the wishlist'
      : response.data.messsage
  
    alert(messsage)
  }

  const onAddToCart = async (_: MouseEvent<HTMLButtonElement>) => {
    const response = await axios.post('/api/customers/@me/cart/add/', {
      bookId: book._id, quantity: 1
    })

    let messsage = (response.status === 201)
      ? 'Book is now added to the cart'
      : response.data.messsage
  
    alert(messsage)
  }

  return (
    <div className="book-card">
      <div className="book-info">
        <CoverImage
          src={`/api/static${book.coverImage}`}
          alt={book.title}
          onClick={goToBookPage}
        />
        <h3 className="book-title" onClick={goToBookPage}>{book.title}</h3>
      </div>
      <span>₹{book.price ? book.price.toFixed(2): '---'}</span>
      {book.unitsInStock && <span>In Stock: {book.unitsInStock}</span>}
      <div className="book-actions">
        <button title="Add to Wishlist" onClick={onAddToWishlist}>❤️</button>
        <button title="Add to Cart" onClick={onAddToCart}>🛒</button>
      </div>
    </div>
  )
}
