import axios from "axios"

import { IBlockableUser } from "../types/user"
import { GetSearchResultsProps } from "../types/commonTypes"


const CUSTOMER_API_URL = `/api/customer/`


export async function getCustomersAPI(props?: GetSearchResultsProps<IBlockableUser>) {
  const {
    query = '', limit = 10, fields = ['_id', 'name', 'email', 'blocked'],
    sort = 'name', order = 'asc'
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
  const response = await axios.get(`${CUSTOMER_API_URL}${customerId}`, { withCredentials: true })

  if (response.status >= 400) {
    alert(response.data.error)
    throw new Error(response.data.error)
  }

  return response
}


export async function updateCustomerAPI(
  customerId: string, data: Partial<Omit<IBlockableUser, '_id'>>
) {
  const response = await axios.patch(`${CUSTOMER_API_URL}${customerId}`, data, {
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
//     `${CUSTOMER_API_URL}${customerId}/change-password`, { oldPassword, newPassword },
//     { withCredentials: true }
//   )

//   if (response.status >= 400) {
//     alert(response.data.error)
//     throw new Error(response.data.error)
//   }

//   return response
// }

export async function deleteCustomerAPI(customerId: string) {
  const response = await axios.delete(`${CUSTOMER_API_URL}${customerId}`, { withCredentials: true })

  if (response.status >= 400) {
    alert(response.data.error)
    throw new Error(response.data.error)
  }

  return response
}  

export async function blockCustomerAPI(customerId: string) {
  const response = await axios.patch(`${CUSTOMER_API_URL}${customerId}/block`, {},
    { withCredentials: true }
  )

  if (response.status >= 400) {
    alert(response.data.error)
    throw new Error(response.data.error)
  }

  return response
}

export async function unblockCustomerAPI(customerId: string) {
  const response = await axios.patch(`${CUSTOMER_API_URL}${customerId}/unblock`, {},
    { withCredentials: true }
  )

  if (response.status >= 400) {
    alert(response.data.error)
    throw new Error(response.data.error)
  }

  return response
}
