import { useEffect, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import axios from "axios"

import { IBook, IBookWithSellerName } from "../../../types/book"
import { BookCard } from "../../Common/Home/Home"
import { useAuth } from "../../../hooks/useAuth"


interface IAnalyticsProps {
  booksInStock: IBook[]
  booksSold: IBook[]
}


export default function SHome() {
  const  { user } = useAuth().authState
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
        console.log(analytics)
      } catch (err) {
        console.error(err)
        alert(err)
      }
    }
    getAnalytics()
  }, [])

  return (
    <div className="analytics-container">
      <p className="books-in-stock">Total Books in stock: {analytics.booksInStock.length}</p>
      <p className="sold-books">Total Books that are sold: {analytics.booksSold.length}</p>
      <p className="stocked-books-count">
        Total books stocked: {analytics.booksInStock.length + analytics.booksSold.length}
      </p>
      <button onClick={() => navigate('/seller/add-a-book')}>Add a Book</button>
      <h3>Your books</h3>
      {
        ((analytics.booksInStock.length + analytics.booksSold.length) === 0)
        ? <p>
            You haven't stocked any books yet <br />
            <Link to='/seller/add-a-book'>Add your first book</Link>
          </p>
        : <div className="books-list">
          {(
            analytics.booksInStock.map((book, key) => {
              let _book = { ...book, sellerName: user?.name } as IBookWithSellerName
              return <BookCard key={key} book={_book} />
            })
          )}
          {(
            analytics.booksSold.map((book, key) => {
              let _book = { ...book, sellerName: user?.name } as IBookWithSellerName
              return <BookCard key={key} book={_book} />
            })
          )}
        </div>
      }
    </div>
  )
}
