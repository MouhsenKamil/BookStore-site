import { MouseEvent } from "react"
import { useNavigate } from "react-router-dom"
// import axios from "axios"

import { IBookWithSellerName } from "../../types/book"

import './BookCard.css'


const onAddToWishlist = async (event: MouseEvent<HTMLButtonElement>) => {
  
}


const onAddToCart = async (event: MouseEvent<HTMLButtonElement>) => {
  console.log('clicked add to cart')
}


// const onBuy = async (event: MouseEvent<HTMLButtonElement>) => {
//   console.log('clicked buy now')
// }


export default function BookCard(props: { book: IBookWithSellerName }) {
  const { book } = props
  const navigate = useNavigate()

  function goToBookPage() {
    navigate(`/book/${book.id}`)
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
        {/* {book.subtitle && <h5>{book.subtitle}</h5>} */}
        {/* <span>by <b>{book.authorName}</b></span> */}
        {/* {book.description && <p>{book.description?.substring(0, 30)}</p>} */}
      </div>
      <span>₹{book.price ? book.price.toFixed(2): '---'}</span>
      <div className="book-actions">
        <button title="Add to Wishlist" onClick={onAddToWishlist}>❤️</button>
        <button title="Add to Cart" onClick={onAddToCart}>🛒</button>
        {/* <button onClick={onBuy}>Buy Now</button> */}
      </div>
    </div>
  )
}
