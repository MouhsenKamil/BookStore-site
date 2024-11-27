import { Link } from "react-router-dom"

import BookListItem from "../../Common/BookListItem/BookListItem"
import useCart from "../../../hooks/useCart"

import './Cart.css'


export default function Cart() {
  const { cart, clearCart, removeBookFromCart, checkoutCart } = useCart()

  console.log(cart)

  return (
    <div className="customer-cart">
      <h3>Your cart has {cart.length} books</h3>{
        (cart.length === 0)
          ? <h5>No items in cart. <Link to='/'>Start shopping for books now.</Link></h5>
          : <>
            <div className="cart-books-list">
              {(cart.map((book, key) => (
                <BookListItem key={key} book={book}>
                  <button className="remove-from-cart-btn" onClick={async (e) => {
                    let target = e.currentTarget ?? e.target
                    try {
                      await removeBookFromCart(book._id)
                      target.inputMode = "Removed from Cart ✅"
                    } catch {
                      target.inputMode = "Error Occurred ❗"
                    }

                    setTimeout(() => {
                      target.innerText = "Remove from Cart"
                    }, 2500)
                  }}>
                    Remove from Cart
                  </button>
                </BookListItem>
              )))
            }</div>
            <button onClick={clearCart}>Clear Cart</button>
            <button onClick={checkoutCart}>Checkout</button>
          </>
      }
    </div>
  )
}
