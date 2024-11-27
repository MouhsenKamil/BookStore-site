import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import axios from "axios"

import { IOrder } from "../../../types/order"
import { getTimeDiff, toTitleCase } from "../../../utils/stringUtils"
import BookListItem from "../../Common/BookListItem/BookListItem"

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

    return (
      <div className="order-list-item">
        <div className="order-details">
          <p className="order-id"><strong>ID: </strong>{orderItem._id}</p>
          <p className="ordered-time"><strong>Ordered on: </strong>{(new Date(orderItem.orderTime)).toLocaleString()}</p>
          <p className="delivered-time"><strong>Delivered by: </strong>
            <br /> {(new Date(orderItem.deliveredBy)).toLocaleString()}
            <br /> (in {getTimeDiff(orderItem.orderTime, orderItem.deliveredBy)})
          </p>
          <p className="delivery-status">
            <strong>Delivery Status: </strong>
            <span style={{ color: (orderItem.status === 'delivered') ? 'lightgreen': 'orange', fontWeight: "bold" }}>
              {orderItem.status.toUpperCase()}
            </span>
          </p>
          <p className="payment-method">
            <strong>Payment Method: </strong>
            {toTitleCase(orderItem.paymentMethod)}
          </p>
          <p className="shipping-address">
            <strong>Shipping Address: </strong>
            {orderItem.homeNo}, {toTitleCase(orderItem.street)}, {toTitleCase(orderItem.city)} 
            {toTitleCase(orderItem.state)}, {toTitleCase(orderItem.country)} - {orderItem.pinCode}
          </p>
          {/* <p><strong>Your Phone No. for delivery guidance: </strong> {orderItem.phoneNo}</p> */}
          <br />
          <button onClick={_ => cancelOrder()}>Cancel Order</button>
        </div>
        <div className="order-books-list">
          {orderItem.books.map((book, key) => (
            <BookListItem key={key} book={book} />
          ))}
        </div>
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
    <div className="customer-orders">
      <h2>Your Orders</h2>{
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
