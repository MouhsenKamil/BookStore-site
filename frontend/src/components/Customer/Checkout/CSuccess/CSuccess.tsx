import { useLocation } from "react-router-dom"


// interface ICheckoutSuccessData {
//   orderId: string,
//   deliveredBy: Date
// }

export function CSuccess() {
  const location = useLocation()
  const checkoutSuccessData = Object.fromEntries(new URLSearchParams(location.search))

  if (Object.keys(checkoutSuccessData).length === 0)
    throw new Error('Missing parameters: orderId, deliverBy')

  if (!checkoutSuccessData)
    return <h4>No purchase has been done.</h4>

  return (
    <>
      <h4>Your Order has been created successfully</h4>
      <h6>Order ID: {checkoutSuccessData.orderId}</h6>
      <h6>Delivered on: {(new Date(checkoutSuccessData.deliveredBy)).toUTCString()}</h6>
    </>
  )
}