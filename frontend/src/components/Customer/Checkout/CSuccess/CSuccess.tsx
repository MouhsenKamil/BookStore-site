import { Link, useLocation } from "react-router-dom"


// interface ICheckoutSuccessData {
//   orderId: string,
//   deliveredBy: Date
// }

export default function CSuccess() {
  const location = useLocation()
  const checkoutSuccessData = Object.fromEntries(new URLSearchParams(location.search))

  if (!Object.keys(checkoutSuccessData).length)
    throw new Error('Missing parameters: orderId, deliverBy')

  if (!checkoutSuccessData)
    return <h4>No purchase has been done.</h4>

  return (
    <div className="checkout-success">
      <h3>Your Order has been created successfully</h3>
      <h4>Order ID: {checkoutSuccessData.orderId}</h4>
      <h4>Delivered on: {checkoutSuccessData.deliveredBy}</h4>
      <Link to='/'>Return Home</Link>
    </div>
  )
}
