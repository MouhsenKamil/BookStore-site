import axios from "axios"

import { IBlockableUser } from "../types/user"


export interface getBlockableUserAPIProps {
  query?: string
  limit?: number
  fields?: (keyof IBlockableUser)[] | string[]
  sort?: Omit<keyof IBlockableUser, '_id'>
  order?: 'asc' | 'desc'
}


export async function getCustomersAPI(props?: getBlockableUserAPIProps) {
  const {
    query = '', limit = 10, fields = ['_id', 'name', 'email', 'blocked'], sort = 'name', order = 'asc'
  } = props || {}

  const response = await axios.get("/api/admin/customers", {
    params: { query, fields, limit, sort, order },
    withCredentials: true
  })

  if (response.status >= 400) {
    alert(response.data.error)
    throw new Error(response.data.error)
  }

  return response
}


export async function getCustomerByIdAPI(customerId: string) {
  const response = await axios.get(`/api/customer/${customerId}`, { withCredentials: true })

  if (response.status >= 400) {
    alert(response.data.error)
    throw new Error(response.data.error)
  }

  return response
}


export async function updateCustomerAPI(customerId: string, data: Record<string, any>) {
  const response = await axios.patch(`/api/customer/${customerId}`, data, {
    withCredentials: true
  })

  if (response.status >= 400) {
    alert(response.data.error)
    throw new Error(response.data.error)
  }

  return response
}

// export async function changeUserPasswordAPI(customerId: string, oldPassword: string, newPassword: string) {
//   const response = await axios.patch(
//     `/api/customer/${customerId}/change-password`, { oldPassword, newPassword },
//     { withCredentials: true }
//   )

//   if (response.status >= 400) {
//     alert(response.data.error)
//     throw new Error(response.data.error)
//   }

//   return response
// }

export async function deleteCustomerAPI(customerId: string) {
  const response = await axios.delete(`/api/customer/${customerId}`, { withCredentials: true })

  if (response.status >= 400) {
    alert(response.data.error)
    throw new Error(response.data.error)
  }

  return response
}  

export async function blockCustomerAPI(customerId: string) {
  const response = await axios.patch(`/api/customer/${customerId}/block`, {},
    { withCredentials: true }
  )

  if (response.status >= 400) {
    alert(response.data.error)
    throw new Error(response.data.error)
  }

  return response
}

export async function unblockCustomerAPI(customerId: string) {
  const response = await axios.patch(`/api/customer/${customerId}/unblock`, {},
    { withCredentials: true }
  )

  if (response.status >= 400) {
    alert(response.data.error)
    throw new Error(response.data.error)
  }

  return response
}
