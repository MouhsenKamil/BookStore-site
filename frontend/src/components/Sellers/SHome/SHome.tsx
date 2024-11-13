import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import axios from "axios"

import { IBook } from "../../../types/book"


export default function SHome() {
  const navigate = useNavigate()

  const [booksInStock, setBooksInStock] = useState<IBook[]>([])
  const [booksSold, setBooksSold] = useState<IBook[]>([])

  useEffect(() => {
    async function getAnalytics() {
      const response = await axios.get("/api/seller/@me/analytics")
      if (response.status !== 200)
        alert("Can't fetch details")

      setBooksInStock(response.data.booksInStock)
      setBooksSold(response.data.booksSold)
    }

    getAnalytics()
  }, [])

  return (
    <div className="seller-analytics">
      <p className="books-in-stock">Books in stock: ${booksInStock.length}</p>
      <p className="sold-books">Books that are sold: ${booksSold.length}</p>
      <p className="stocked-books-count">
        Total books stocked: ${booksInStock.length + booksSold.length}
      </p>
      <button onClick={() => navigate('/seller/@dd-a-book')}>Add a Book</button>
    </div>
  )
}
