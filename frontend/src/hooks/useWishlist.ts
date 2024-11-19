import { IBookInWishlist } from "../types/wishlist"
import { useState } from "react"

import {
  addBookToWishlist, getWishlistOfUser, removeBookFromWishlist, clearWishlist
} from "../services/wishlistServices"


export default function useWishlist() {
  const [wishlist, setWishlist] = useState<IBookInWishlist[]>([])

  return { wishlist, addBookToWishlist, getWishlistOfUser, removeBookFromWishlist, clearWishlist }
}
