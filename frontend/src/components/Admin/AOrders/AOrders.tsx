import { IOrder, PaymentMethod, OrderStatus } from "../../../types/order"

// interface OrderDetailsProps {
//   order: IOrder
// }


export default function AOrders() {
  return (
    <div className="admin-window orders-container">
      <h2>Order Details</h2>
      <p><strong>User ID:</strong> {order.user}</p>
      <p><strong>Order Time:</strong> {new Date(order.orderTime).toLocaleString()}</p>
      <p><strong>Delivery By:</strong> {new Date(order.deliveredBy).toLocaleString()}</p>
      <p><strong>Status:</strong> {order.status}</p>
      
      <h3>Shipping Address</h3>
      <p>{order.homeNo}, {order.street}</p>
      <p>{order.city}, {order.state}, {order.country} - {order.pinCode}</p>
      <p><strong>Phone:</strong> {order.phoneNo}</p>

      <h3>Payment</h3>
      <p><strong>Method:</strong> {order.paymentMethod}</p>

      <h3>Books</h3>
      {order.books.length > 0 ? (
        <ul>
          {order.books.map((book, index) => (
            <li key={index}>
              <p><strong>Book ID:</strong> {book.id}</p>
              <p><strong>Quantity:</strong> {book.quantity}</p>
            </li>
          ))}
        </ul>
      ) : (
        <p>No books in this order.</p>
      )}
    </div>
  )
}
