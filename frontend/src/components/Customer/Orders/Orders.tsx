import { Link, useNavigate, useParams } from "react-router-dom"

import { IOrder } from "../../../types/order"
import { getTimeDiff, toTitleCase } from "../../../utils/stringUtils"
import BookListItem from "../../Common/BookListItem/BookListItem"
import { useAuth } from "../../../hooks/useAuth"
import { cancelOrderAPI } from "../../../services/ordersServices"
import useOrders from "../../../hooks/useOrders"

import './Orders.css'


interface OrdersListItemProps {
  orderItem: IOrder
  userId?: string
}


export function OrdersListItem({ orderItem, userId }: OrdersListItemProps) {
  return (
    <div className="order-list-item">
      <div className="order-details">
        <p className="order-id"><strong>ID: </strong>{orderItem._id}</p>
        <p className="ordered-time"><strong>Ordered on: </strong>{orderItem.orderTime.toLocaleString()}</p>
        <p className="delivered-time"><strong>Delivered by: </strong>
          <br />&nbsp;&nbsp; {orderItem.deliveredBy.toLocaleString()}
          <br />&nbsp;&nbsp; (in {getTimeDiff(orderItem.orderTime, orderItem.deliveredBy)})
        </p>
        <p className="delivery-status">
          <strong>Delivery Status: </strong>
          <span style={
            { color: (orderItem.status === 'delivered') ? 'lightgreen': 'orange', fontWeight: "bold" }
          }>
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
        <button onClick={async () => await cancelOrderAPI(orderItem._id, userId)}>Cancel Order</button>
      </div>
      <div className="order-books-list">
        {orderItem.books.map((book, key) => (
          <BookListItem key={key} book={book} />
        ))}
      </div>
    </div>
  )
}


export default function Orders() {
  const { user } = useAuth().authState
  const { customerId } = useParams()
  const navigate = useNavigate()

  if (user?.type === 'admin' && (!customerId || customerId === "undefined")) {
    alert("Parameter 'customerId' has no value.")
    navigate('/')
    return
  }

  const { orders } = useOrders({ userId: customerId })

  return (
    <div className="customer-orders">
      <h2>Your Orders</h2>{
      ((orders ?? []).length === 0)
        ? <h3>You haven't done any orders. <Link to='/'>Start shopping now.</Link></h3>
        : <div className="orders-list">
            {(orders.map((order, key) => (
              <OrdersListItem key={key} orderItem={order} userId={customerId} />
            )))}
          </div>
    }</div>
  )
}
