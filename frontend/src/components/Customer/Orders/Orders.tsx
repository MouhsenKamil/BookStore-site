import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import axios from "axios"

import { IOrder } from "../../../types/order"

import './Orders.css'


export default function Orders() {
  const [orders, setOrders] = useState<IOrder[]>([])

  function OrdersListItem({ orderItem }: { orderItem: IOrder }) {
    async function cancelOrder() {
      const response = await axios.delete(
        `/api/customer/@me/order/${orderItem._id}`, { withCredentials: true }
      )
  
      if (response.status >= 400)
        alert(response.data.error)

      else {
        setOrders(orders.filter(order => order._id !== orderItem._id))
        alert('Order has been cancelleed successfully')
      }
    }
  
    return (
      <div className="order-list-item">
        <p><strong>Order Time:</strong>{new Date(orderItem.orderTime).toLocaleString()}</p>
        <p><strong>Delivery Date:</strong>{new Date(orderItem.deliveredBy).toLocaleString()}</p>
        <p><strong>Delivery Status:</strong>{orderItem.status}</p>
        <p><strong>Payment Method:</strong>{orderItem.paymentMethod}</p>
        <p><strong>Shippin Address:</strong>{
          `${orderItem.homeNo}, ${orderItem.street}, ${orderItem.city}, ${orderItem.state}, ` +
          `${orderItem.country} - ${orderItem.pinCode}`
        }</p>
        <p><strong>Phone:</strong> {orderItem.phoneNo}</p>
        <p><strong>Books:</strong></p>
        <ul>
          {orderItem.books.map((book, key) => (
            <li key={key}>
              <span>Book ID: <Link to={`/book/${book._id}`}>{book._id}</Link></span>
              <span> (x{book.quantity || 1})</span>
            </li>
          ))}
        </ul>
        <button onClick={_ => cancelOrder()}></button>
      </div>
    )
  }

  async function fetchOrders() {
    const response = await axios.get(`/api/customer/@me/order/list`, { withCredentials: true })
    console.log(response.data)
    if (response.status >= 400)
      alert(response.data.error)

    else
      setOrders(response.data)
  }

  useEffect(() => {
    fetchOrders()
  }, [])

  return (
    <div className="customer-orders">
      <h3>Your cart has {(orders ?? []).length} books</h3>{
        ((orders ?? []).length === 0)
          ? <h5>You haven't done any orders. <Link to='/'>Start shopping now.</Link></h5>
          : <>
            <div className="orders-list">
              {(orders.map((order, key) => <OrdersListItem key={key} orderItem={order} />))}
            </div>
          </>
      }
    </div>
  )
}
