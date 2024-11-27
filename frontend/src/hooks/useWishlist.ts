import { useEffect, useState } from "react"
import axios from "axios"

import {
  addBookToWishlistAPI, getWishlistOfUserAPI, removeBookFromWishlistAPI, clearWishlistAPI
} from "../services/wishlistServices"
import { IBookInWishlist } from "../types/wishlist"
import { useAuth } from "./useAuth"


export default function useWishlist(props?: { userId?: string }) {
  const { userId = '@me' } = props || {}
  const { user } = useAuth().authState
  const [wishlist, setWishlist] = useState<IBookInWishlist[]>([])

  if (!user)
    throw new Error("User type not found")

  if (user.type !== 'customer')
    throw new Error(`Unknown user type: ${user.type}`)

  useEffect(() => {
    getWishlistOfUserAPI({ userId })
      .then(response => setWishlist(response.data))
  }, [])


  async function addBookToWishlist(bookId: string) {
    await addBookToWishlistAPI(bookId, { userId })

    const bookRes = await axios.get('/api/books/' + bookId)

    setWishlist([...wishlist, {
      _id: bookRes.data._id,
      title: bookRes.data.title,
      price: bookRes.data.price,
      unitsInStock: bookRes.data.unitsInStock,
      coverImage: bookRes.data.coverImage
    }])

    alert("Book has been added to wishlist successfully")
  }


  async function getWishlistOfUser() {
    return wishlist
  }

  async function removeBookFromWishlist(bookId: string) {
    await removeBookFromWishlistAPI(bookId, {userId})
    setWishlist(wishlist.filter(book => book._id !== bookId))
    alert("Book has been removed to wishlist successfully")
  }

  async function clearWishlist() {
    await clearWishlistAPI({ userId })
    setWishlist([])
    alert("Wishlist has been cleared successfully")
  }

  return { wishlist, addBookToWishlist, getWishlistOfUser, removeBookFromWishlist, clearWishlist }
}
