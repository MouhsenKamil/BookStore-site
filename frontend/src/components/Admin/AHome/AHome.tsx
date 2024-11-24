import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import axios from "axios"
import { IBook } from "../../../types/book"
import { IOrder } from "../../../types/order"


interface ISiteAnalytics {
  totalCustomers: number
  totalSellers: number
  totalBooks: IBook[]
  totalBooksSold: IBook[]
  totalOrders: IOrder[]
}


export default function AHome() {
  const [analytics, setAnalytics] = useState<ISiteAnalytics>({
    totalCustomers: 0,
    totalSellers: 0,
    totalBooks: [],
    totalBooksSold: [],
    totalOrders: [],
  })

  useEffect(() => {
    async function fetchSiteAnalytics() {
      try {
        const response = await axios.get("/api/admin/analytics", { withCredentials: true })
        if (response.status !== 200)
          alert(response.data.error)
        else
          setAnalytics(response.data)
      } catch (error) {
        console.error(error)
      }
    }

    fetchSiteAnalytics()
  }, [])

  return (
    <div className="site-analytics">
      <p>Total Users: {analytics.totalCustomers}</p>
      <p>Total Sellers: {analytics.totalSellers}</p>
      <p>Total Books in Stock: {analytics.totalBooks.length}</p>
      <p>Total Books Sold: {10}</p>
      <p>Total Orders: {analytics.totalOrders.length}</p>

      <Link to='/admin/customers'>Customers</Link>
      <br />
      <Link to='/admin/sellers'>Sellers</Link>
      <br />
      <Link to='/admin/books'>Books</Link>
    </div>
  )
}
