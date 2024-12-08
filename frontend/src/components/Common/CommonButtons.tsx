import { addBookToCartAPI } from "../../services/cartServices"
import { addBookToWishlistAPI } from "../../services/wishlistServices"


export function AddtoWishlistButton({ bookId }: { bookId: string }) {
  return (
    <button type="button" title="Add to Wishlist" onClick={async (e) => {
      const target = e.currentTarget ?? e.target
      try {
        await addBookToWishlistAPI(bookId)
        target.innerText = "Added to Wishlist ✅"
      } catch {
        target.innerText = "Error Occurred ❗"
      }

      setTimeout(() => {
        target.innerText = "Add to Wishlist ⭐"
      }, 2500)
    }}>
      Add to Wishlist ⭐
    </button>
  )
}


export function AddtoCartButton({ bookId }: { bookId: string }) {
  return (
    <button type="button" title="Add to Cart" onClick={async (e) => {
      const target = e.currentTarget ?? e.target
      try {
        addBookToCartAPI(bookId)
        e.currentTarget.innerText = "Added to Cart ✅"
      } catch {
        target.innerText = "Error Occurred ❗"
      }

      setTimeout(() => {
        target.innerText = "Add to Cart 🛒"
      }, 2500)

    }}>Add to Cart 🛒
    </button>
  )
}
