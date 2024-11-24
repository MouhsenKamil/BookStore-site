import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import axios from "axios"

import { IOrder } from "../../../types/order"
import { toTitleCase } from "../../../utils/stringUtils"
import BookListItem from "../BookListItem/BookListItem"

import './Orders.css'


export default function Orders() {
  const [orders, setOrders] = useState<IOrder[]>([])

  function OrdersListItem({ orderItem }: { orderItem: IOrder }) {
    async function cancelOrder() {
      console.log(orderItem._id)
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

    console.log(orderItem)

    return (
      <div className="order-list-item">
        <div className="order-details">
          <p><strong>Order Time: </strong>{(new Date(orderItem.orderTime)).toLocaleString()}</p>
          <p><strong>Delivery Date: </strong>{(new Date(orderItem.deliveredBy)).toLocaleString()}</p>
          <p><strong>Delivery Status: </strong>{toTitleCase(orderItem.status)}</p>
          <p><strong>Payment Method: </strong>{orderItem.paymentMethod}</p>
          <p><strong>Shippin Address: </strong>{
            `${orderItem.homeNo}, ${orderItem.street}, ${orderItem.city}, ${orderItem.state}, ` +
            `${orderItem.country} - ${orderItem.pinCode}`
          }</p>
          {/* <p><strong>Your Phone No. for delivery guidance: </strong> {orderItem.phoneNo}</p> */}
        </div>
        <p><strong>Books: </strong></p>
        <div className="orders-books-list-item">
          {orderItem.books.map((book, key) => (
            <BookListItem key={key} book={book} />
          ))}
        </div>
        <button onClick={_ => cancelOrder()}>Cancel Order</button>
      </div>
    )
  }

  async function fetchOrders() {
    const response = await axios.get(`/api/customer/@me/order/list`, { withCredentials: true })
    if (response.status >= 400)
      alert(response.data.error)

    else
      setOrders(response.data)
  }

  useEffect(() => {
    fetchOrders()
  }, [])

  return (
    <div className="customer-orders">{
      ((orders ?? []).length === 0)
        ? <h3>You haven't done any orders. <Link to='/'>Start shopping now.</Link></h3>
        : <>
          <div className="orders-list">
            {(orders.map((order, key) => <OrdersListItem key={key} orderItem={order} />))}
          </div>
        </>
    }</div>
  )
}
