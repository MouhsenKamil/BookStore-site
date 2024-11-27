import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import axios from "axios"

import './AHome.css'


interface ISiteAnalytics {
  totalCustomers: number
  totalSellers: number
  totalBooks: number
  totalBooksSold: number
  totalOrders: {
    packaging: number
    onDelivery: number
    delivered: number
    cancelled: number
    aborted: number
  }
}


export default function AHome() {
  const [analytics, setAnalytics] = useState<ISiteAnalytics>({
    totalCustomers: 0,
    totalSellers: 0,
    totalBooks: 0,
    totalBooksSold: 0,
    totalOrders: {
      packaging: 0,
      onDelivery: 0,
      delivered: 0,
      cancelled: 0,
      aborted: 0,
    },
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
    <div className="analytics-container admin-analytics">
      <div className="analytics-section customers-section">
        <p className="analytics-header">
          <Link to='/admin/customers'>Customers</Link>
        </p>
        <p className="analytics-value">{analytics.totalCustomers}</p>
      </div>
      <div className="analytics-section sellers-section">
        <p className="analytics-header">
          <Link to='/admin/sellers'>Sellers</Link>
        </p>
        <p className="analytics-value">{analytics.totalSellers}</p>
      </div>
      <div className="analytics-section books-in-stock-section">
        <p className="analytics-header">
          <Link to='/admin/books'>Books in Stock</Link>
        </p>
        <p className="analytics-value">{analytics.totalBooks}</p>
      </div>
      <div className="analytics-section books-sold-section">
        <p className="analytics-header">Books Sold</p>
        <p className="analytics-value">{analytics.totalBooksSold}</p>
      </div>
      <div className="analytics-section orders-section">
        <p className="analytics-header">
          <Link to='/admin/orders'>Orders</Link>
        </p>
        <p className="analytics-value">{
          Object.values(analytics.totalOrders).reduce((acc, order) => acc + order, 0)
        }</p>

        <span className="orders-status-section" title="Packaging">
          {analytics.totalOrders.packaging}
        </span>
        /
        <span className="orders-status-section" style={{ color: 'lightgreen' }} title="On Delivery">
          {analytics.totalOrders.onDelivery}
        </span>
        /
        <span className="orders-status-section" style={{ color: 'green' }} title="Delivered">
          {analytics.totalOrders.delivered}
        </span>
        /
        <span className="orders-status-section" style={{ color: 'orange' }} title="Cancelled">
          {analytics.totalOrders.cancelled}
        </span>
        /
        <span className="orders-status-section" style={{ color: 'red' }} title="Aborted">
          {analytics.totalOrders.aborted}
        </span>
      </div>
    </div>
  )
}
