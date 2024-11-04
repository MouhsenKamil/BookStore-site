import { IBook } from "../../types/book"

interface BookCardProps {
  book: IBook
  onAddToCart?: () => void
  onBuy?: () => void
}

export default function BookCard({ book, onAddToCart, onBuy }: BookCardProps) {
  return (
    <div className="book-card">
      <img src={book.coverImage} alt={book.title} />
      <div className="book-info">
        <h3>{book.title}</h3>
        <p>by {book.author}</p>
        <p>₹{book.price.toFixed(2)}</p>
        <p><b>Seller: </b>{book.seller}</p>
        <p>{book.description}</p>
        <div className="book-actions">
          <button onClick={onAddToCart}>Add to Cart</button>
          <button onClick={onBuy}>Buy Now</button>
        </div>
      </div>
    </div>
  )
}
