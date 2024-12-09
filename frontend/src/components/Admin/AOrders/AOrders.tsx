import { useEffect, useState } from "react"

import {
  cancelOrderAPI,
  convertTimeStringToDateObj,
  getOrdersAPI,
  sortOrdersByOrderTime
} from "../../../services/ordersServices"
import { IOrder } from "../../../types/order"
import BookListItem from "../../Common/BookListItem/BookListItem"
import { getTimeDiff, toTitleCase } from "../../../utils/stringUtils"

import '../../Customer/Orders/Orders.css'


interface OrdersListItemProps {
  orderItem: IOrder
  userId?: string
}


export function OrdersListItem({ orderItem, userId }: OrdersListItemProps) {
  return (
    <div className="order-list-item">
      <div className="order-details">
        <p className="customer-id"><strong>Customer ID: </strong>{orderItem.user}</p>
        <p className="order-id"><strong>Order ID: </strong>{orderItem._id}</p>
        <p className="ordered-time"><strong>Ordered on: </strong>{orderItem.orderTime.toLocaleString()}</p>
        <p className="delivered-time"><strong>Delivered by: </strong>
          <br />&nbsp;&nbsp; {orderItem.deliveredBy.toLocaleString()}
          <br />&nbsp;&nbsp; (in {getTimeDiff(orderItem.orderTime, orderItem.deliveredBy)})
        </p>
        <p className="delivery-status">
          <strong>Delivery Status: </strong>
          <span style={
            { color: (orderItem.status === 'delivered') ? 'lightgreen' : 'orange', fontWeight: "bold" }
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
  const [orders, setOrders] = useState<IOrder[]>([])

  useEffect(() => {
    getOrdersAPI({})
      .then(response => {
        const ordersList: IOrder[] = response.data
        setOrders(
          sortOrdersByOrderTime(ordersList.map(convertTimeStringToDateObj))
        )
      })
  }, [])

  return (
    <div className="customer-orders">
      <h2>Your Orders</h2>{
        ((orders ?? []).length === 0)
          ? <h3>There aren't any orders right now.</h3>
          : <div className="orders-list">
            {(orders.map((order, key) => <OrdersListItem key={key} orderItem={order} />))}
          </div>
      }</div>
  )
}
