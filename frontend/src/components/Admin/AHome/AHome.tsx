import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import axios from "axios"


interface ISiteAnalytics {
  totalCustomers: number
  totalSellers: number
  totalBooks: number
  totalBooksSold: number
  totalOrders: number
}


export default function AHome() {
  const [analytics, setAnalytics] = useState<ISiteAnalytics>({
    totalCustomers: 0,
    totalSellers: 0,
    totalBooks: 0,
    totalBooksSold: 0,
    totalOrders: 0,
  })

  useEffect(() => {
    async function fetchSiteAnalytics() {
      try {
        const response = await axios.get("/api/admin/analytics")
        if (response.status === 200) {
          setAnalytics(response.data)
        } else {
          alert("Failed to fetch site analytics.")
        }
      } catch (error) {
        console.error("Error fetching analytics:", error)
        alert("An error occurred while fetching analytics.")
      }
    }

    fetchSiteAnalytics()
  }, [])

  return (
    <div className="site-analytics">
      <p>Total Users: {analytics.totalCustomers}</p>
      <p>Total Sellers: {analytics.totalSellers}</p>
      <p>Total Books in Stock: {analytics.totalBooks}</p>
      <p>Total Books Sold: {analytics.totalBooksSold}</p>
      <p>Total Orders: {analytics.totalOrders}</p>

      <Link to='/admin/customers'>customers</Link>
      <Link to='/admin/sellers'>Sellers</Link>
      <Link to='/admin/books'>Books</Link>
    </div>
  )
}
