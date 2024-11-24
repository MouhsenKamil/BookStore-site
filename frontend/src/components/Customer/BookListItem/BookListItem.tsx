import { useNavigate } from "react-router-dom"
import { IBookInCart } from "../../../types/cart"
import CoverImage from "../../Common/CoverImage/CoverImage"

import './BookListItem.css'


export default function BookListItem(props: { book: IBookInCart, children?: React.ReactNode }) {
  const navigate = useNavigate()
  const { book, children } = props

  function goToBookPage() {
    navigate(`/book/${book._id}`)
  }

  return (
    <div className="book-list-item">
      <div className="image-container">
        <CoverImage coverImg={book.coverImage} alt={book.title} onClick={goToBookPage} />
        <div className="book-details">
          <div className="book-title" onClick={goToBookPage} title={book.title}>
            {book.title}
          </div>
          {book.price && <b style={{ color: 'orange' }}>₹ {book.price.toFixed(2)}</b>}
          {book.quantity && <span>Quantity: {book.quantity}</span>}
          {book.unitsInStock && <span>
            <span style={{color: '#15dd15'}}>In Stock: </span>
            {book.unitsInStock}</span>
          }
          {children}
        </div>
      </div>
    </div>
  )
}
