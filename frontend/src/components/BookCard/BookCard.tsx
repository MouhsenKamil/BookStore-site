import { IBookWithSellerName } from "../../../../backend/src/models/Book"


interface BookCardProps {
  book: IBookWithSellerName
  onAddToCart?: () => void
  onBuy?: () => void
}


export default function BookCard({ book, onAddToCart, onBuy }: BookCardProps) {
  return (
    <div className="book-card">
      <img
        src={book.coverImage ? `/api/static${book.coverImage}`: 'src/assets/cover-image-placeholder.png'}
        alt={book.title}
      />
      <div className="book-info">
        <h3>{book.title}</h3>
        {book.subtitle && <h5>{book.subtitle}</h5>}
        <p>by <b>{book.authorName}</b></p> - 
        <p>₹{book.price.toFixed(2)}</p>
        <p><b>Seller: </b>{book.sellerName}</p>
        <p>{book.description}</p>
        <div className="book-actions">
          <button onClick={onAddToCart}>Add to Cart</button>
          <button onClick={onBuy}>Buy Now</button>
        </div>
      </div>
    </div>
  )
}
