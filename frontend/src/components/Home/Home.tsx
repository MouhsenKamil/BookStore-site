import { useState, useEffect } from "react"
import axios from "axios"

import BookCard from "../BookCard/BookCard"


export default function Home() {
  const [newBooks, setNewBooks] = useState([])
  const [lowStockBooks, setLowStockBooks] = useState([])
  const [refreshCount, setRefreshCount] = useState(0) // For triggering manual refresh

  async function fetchBooks(query: string = "", params: { [key: string]: any } = {}) {
    try {
      const response = await axios.get(`/api/books`, {
        params: {
          query,
          fields: ["title", "subtitle", "coverImage", "authorName"],
          ...params,
        },
      })

      return response.data
    } catch (error) {
      console.error("Failed to fetch books:", error)
      return []
    }
  }

  async function loadBooks() {
    const [newListings, lowStock] = await Promise.all([
      fetchBooks("", { sort: "createdAt", limit: 20 }),
      fetchBooks("", { sort: "unitsInStock", limit: 20, order: "asc" }),
    ])
    setNewBooks(newListings)
    setLowStockBooks(lowStock)
  }

  // Fetch books initially and when refreshCount changes
  useEffect(() => {
    loadBooks()
  }, [refreshCount])
  
  return (
    <div className="home-page">
      <button className="refresh-btn" onClick={() => setRefreshCount((val) => val + 1)}>Refresh</button>

      <h2>New Listings</h2>
      <div className="book-list new-listing">
        {newBooks.length > 0 ? (
          newBooks.map((book: any, key: number) => (
            <BookCard key={key} book={book} />
          ))
          ) : <p>Loading new listings...</p>
        }
      </div>

      <h2>Low on Stock (Get 'em Soon!)</h2>
      <div className="book-list low-on-stock">
        {lowStockBooks.length > 0 ? (
          lowStockBooks.map((book: any, key: number) => (
            <BookCard key={key} book={book} />
          ))
          ) : <p>Loading low stock books...</p>
        }
      </div>
    </div>
  )
}
