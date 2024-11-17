import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import axios from "axios"

import { IBook } from "../../../types/book"


interface IAnalyticsProps {
  booksInStock: IBook[]
  booksSold: IBook[]
}


export default function SHome() {
  const navigate = useNavigate()
  const [analytics, setAnalytics] = useState<IAnalyticsProps>({
    booksInStock: [], booksSold: []
  })

  useEffect(() => {
    async function getAnalytics() {
      try {
        const response = await axios.get("/api/seller/@me/analytics", { withCredentials: true })
        if (response.status !== 200)
          throw new Error(response.data.error)

        setAnalytics(response.data)
      } catch (err) {
        console.error(err)
        alert(err)
      }
    }
    getAnalytics()
  }, [])

  return (
    <div className="seller-analytics">
      <p className="books-in-stock">Total Books in stock: {analytics.booksInStock.length}</p>
      <p className="sold-books">Total Books that are sold: {analytics.booksSold.length}</p>
      <p className="stocked-books-count">
        Total books stocked: ${analytics.booksInStock.length + analytics.booksSold.length}
      </p>
      <button onClick={() => navigate('/seller/@dd-a-book')}>Add a Book</button>
    </div>
  )
}
