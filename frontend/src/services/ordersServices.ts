import axios from "axios"

import { createOrderProps, IOrder, IOrderWithDateObj } from "../types/order"
import { GetSearchResultsProps } from "../types/commonTypes"


export function convertTimeStringToDateObj(order: IOrder) {
  return {
    ...order,
    orderTime: new Date(order.orderTime),
    deliveredBy: new Date(order.deliveredBy),
  } as IOrderWithDateObj
}


export function sortOrdersByOrderTime(orders: IOrderWithDateObj[]) {
  return orders
    .map(convertTimeStringToDateObj)
    .sort(
      (order1, order2) => order1.orderTime.getTime() - order2.orderTime.getTime()
    )
}


export async function createOrderAPI(options: createOrderProps, userId: string = "@me") {
  let response

  if (options.type === "bookOnly")
    response = await axios.post(`/api/books/${options.data.bookId}/purchase`, {
      quantity: options.data.quantity,
    }, { withCredentials: true })

  else if (options.type === "cart")
    response = await axios.post(
      `/api/customer/${userId}/cart/checkout`, options.data, { withCredentials: true }
    )

  else
    throw new Error(`checkout method must be either 'cart' or 'bookOnly'`)

  if (response.status >= 400) {
    alert(response.data.error)
    throw new Error(response.data.error)
  }

  return response
}


export async function getOrderByIdAPI(orderId: string, userId: string = "@me") {
  const response = await axios.get(
    `/api/customer/${userId}/order/${orderId}`, { withCredentials: true }
  )

  if (response.status >= 400) {
    alert(response.data.error)
    throw new Error(response.data.error)
  }

  return response
}


export async function updateOrderAPI(
  orderId: string, userId: string = "@me", data: Partial<Omit<IOrder, '_id'>>
) {
  const response = await axios.patch(
    `/api/customer/${userId}/order/${orderId}`, data, { withCredentials: true }
  )

  if (response.status >= 400) {
    alert(response.data.error)
    throw new Error(response.data.error)
  }

  return response
}


export async function cancelOrderAPI(orderId: string, userId: string = "@me") {
  const response = await axios.delete(
    `/api/customer/${userId}/order/${orderId}`, { withCredentials: true }
  )

  if (response.status >= 400) {
    alert(response.data.error)
    throw new Error(response.data.error)
  }

  return response
}


export async function getOrdersAPI(data: Omit<GetSearchResultsProps<IOrder>, 'query'>) {
  const response = await axios.get('/api/admin/orders', { params: data, withCredentials: true })

  if (response.status >= 400) {
    alert(response.data.error)
    throw new Error(response.data.error)
  }

  return response
}


export async function getOrdersListOfUserAPI(userId: string = "@me") {
  const response = await axios.get(
    `/api/customer/${userId}/order/list`, { withCredentials: true }
  )

  if (response.status >= 400) {
    alert(response.data.error)
    throw new Error(response.data.error)
  }

  return response
}
