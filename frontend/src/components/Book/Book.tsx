import { Link, useNavigate, useParams } from "react-router-dom"
import { useState, MouseEvent } from "react"
import axios from "axios"

import { IBookWithSellerName } from "../../types/book"

import './Book.css'


type bookStateType = IBookWithSellerName & Partial<{ error: string }>


const onAddToWishlist = async (event: MouseEvent<HTMLButtonElement>) => {
  
}


const onAddToCart = async (event: MouseEvent<HTMLButtonElement>) => {
  console.log('clicked add to cart')
}


// const onBuy = async (event: MouseEvent<HTMLButtonElement>) => {
//   console.log('clicked buy now')
// }


export default function Book() {
  const { bookId } = useParams()
  const navigate = useNavigate()

  if (bookId === undefined) {
    navigate('/')
    return
  }

  const [book, setBook] = useState<bookStateType>({} as IBookWithSellerName)

  async function getBook(bookId: string) {
    try {
      const response = await axios.get(`/api/books/${bookId}`)

      if (response.status === 200)
        setBook(response.data)
    } catch (e) {
      console.error(e)
    }
  }

  getBook(bookId)

  if (book.error)
    return (
      <>
        <h1>Book not found</h1>
        <Link to='/'>Return to Home</Link>
      </>
    )

  return (
    <>
      <div className="book-display">
        <img
          src={book.coverImage
            ? `/api/static${book.coverImage}`
            : 'src/assets/cover-image-placeholder.png'}
          alt={book.title}
          onClick={() => {
            navigate(`/book/${book.id}`)
          }}
        />
        <div className="book-info">
          <h3 className="book-title">{book.title}</h3>
          {book.subtitle && <h5>{book.subtitle}</h5>}
          <span>by <b>{book.authorName}</b></span>
          <span>₹{book.price ? book.price.toFixed(2) : '---'}</span>
          <span><b>Seller: </b>{book.sellerName}</span>
          {book.description && <p>{book.description?.substring(0, 30)}</p>}
          <div className="book-actions">
          <button title="Add to Wishlist" onClick={onAddToWishlist}>❤️</button>
          <button title="Add to Cart" onClick={onAddToCart}>🛒</button>
            {/* <button onClick={onBuy}>Buy Now</button> */}
          </div>
        </div>
      </div>
    </>
  )
}
