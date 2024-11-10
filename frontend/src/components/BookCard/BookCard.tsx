import { MouseEvent } from "react"
// import axios from "axios"

import { IBookWithSellerName } from "../../../../backend/src/models/Book"

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

  return (
    <div className="book-card">
      <img
        src={book.coverImage
              ? `/api/static${book.coverImage}`
              : 'src/assets/cover-image-placeholder.png'}
        alt={book.title}
      />
      <div className="book-info">
        <h3 className="book-title">{book.title}</h3>
        {book.subtitle && <h5>{book.subtitle}</h5>}
        <span>by <b>{book.authorName}</b></span>
        <span>₹{book.price ? book.price.toFixed(2): '---'}</span>
        {/* <span><b>Seller: </b>{book.sellerName}</span> */}
        {book.description && <p>{book.description?.substring(0, 30)}</p>}
        <div className="book-actions">
          <button onClick={onAddToWishlist}>Add to Wishlist</button>
          <button onClick={onAddToCart}>Add to Cart</button>
          {/* <button onClick={onBuy}>Buy Now</button> */}
        </div>
      </div>
    </div>
  )
}
