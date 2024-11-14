import { MouseEvent } from "react"
import { useNavigate } from "react-router-dom"
import axios from "axios"

import { IBookWithSellerName } from "../../types/book"

import './BookCard.css'


export default function BookCard(props: { book: IBookWithSellerName }) {
  const { book } = props
  const navigate = useNavigate()

  function goToBookPage() {
    navigate(`/book/${book._id}`)
  }

  const onAddToWishlist = async (event: MouseEvent<HTMLButtonElement>) => {
    const response = await axios.post('/api/customers/@me/wishlist/add', {
      bookId: book._id,
    })

    let messsage

    if (response.status === 201)
      messsage = 'Book is now added to the wishlist'
    else
      messsage = response.data.messsage
  
    alert(messsage)
  }

  const onAddToCart = async (event: MouseEvent<HTMLButtonElement>) => {
    const response = await axios.post('/api/customers/@me/cart/add/', {
      bookId: book._id, quantity: 1
    })

    let messsage

    if (response.status === 201)
      messsage = 'Book is now added to the cart'
    else
      messsage = response.data.messsage
  
    alert(messsage)
  }

  return (
    <div className="book-card">
      <div className="book-info">
        <img
          src={book.coverImage
                ? `/api/static${book.coverImage}`
                : 'src/assets/cover-image-placeholder.png'}
          alt={book.title}
          onClick={goToBookPage}
        />
        <h3 className="book-title" onClick={goToBookPage}>{book.title}</h3>
      </div>
      <span>₹{book.price ? book.price.toFixed(2): '---'}</span>
      <div className="book-actions">
        <button title="Add to Wishlist" onClick={onAddToWishlist}>❤️</button>
        <button title="Add to Cart" onClick={onAddToCart}>🛒</button>
      </div>
    </div>
  )
}
