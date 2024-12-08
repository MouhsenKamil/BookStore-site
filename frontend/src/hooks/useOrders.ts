import { useState, useEffect } from "react"

import {
  getOrdersListOfUserAPI,
  updateOrderAPI,
  cancelOrderAPI,
  convertTimeStringToDateObj,
  sortOrdersByOrderTime,
} from '../services/ordersServices'
import { IOrder } from "../types/order"
import { useAuth } from "./useAuth"


export default function useOrders(props?: { userId?: string }) {
  const { userId = "@me" } = props || {}
  const { user } = useAuth().authState

  const [orders, setOrders] = useState<IOrder[]>([])

  if (!user)
    throw new Error("User type not found")

  if (!['customer', 'admin'].includes(user.type))
    throw new Error(`Unknown user type: ${user.type}`)

  useEffect(() => {
    getOrdersListOfUserAPI()
      .then(response => {
        const ordersList: IOrder[] = response.data
        setOrders(
          sortOrdersByOrderTime(ordersList.map(convertTimeStringToDateObj))
        )
      })
  }, [])

  async function getOrderById(orderId: string) {
    return orders.find(order => order._id === orderId)
  }

  async function updateOrder(orderId: string, data: Partial<Omit<IOrder, '_id'>>) {
    const response = await updateOrderAPI(orderId, userId, data)

    const idxOfChangedOrder = orders.findIndex(order => order._id === orderId)
    const newOrdersList = [...orders.filter(c => c._id !== orderId)]
    newOrdersList.splice(idxOfChangedOrder, 0, { ...orders[idxOfChangedOrder], ...data })
  
    setOrders(newOrdersList)
    return response
  }

  async function cancelOrder(orderId: string) {
    const response = await cancelOrderAPI(orderId)
    setOrders(orders.filter(order => order._id !== orderId))
    return response
  }

  return { orders, getOrderById, updateOrder, cancelOrder }
}
