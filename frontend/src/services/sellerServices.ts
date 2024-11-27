import axios from "axios"

import { getBlockableUserAPIProps } from "./customerServices"


export async function getSellersAPI(props?: getBlockableUserAPIProps) {
  const {
    query = '', fields = ['_id', 'name', 'email', 'passportNo', 'phoneNo', 'blocked'],
    sort = 'name', order = 'asc', limit = 10,
  } = props || {}

  const response = await axios.get("/api/admin/sellers", {
    params: { query, fields, limit, sort, order },
    withCredentials: true
  })

  if (response.status >= 400) {
    alert(response.data.error)
    throw new Error(response.data.error)
  }

  return response
}


export async function getSellerByIdAPI(sellerId: string) {
  const response = await axios.get(`/api/seller/${sellerId}`, { withCredentials: true })

  if (response.status >= 400) {
    alert(response.data.error)
    throw new Error(response.data.error)
  }

  return response
}


export async function updateSellerAPI(sellerId: string, data: Record<string, any>) {
  const response = await axios.patch(`/api/seller/${sellerId}`, data, {
    withCredentials: true
  })

  if (response.status >= 400) {
    alert(response.data.error)
    throw new Error(response.data.error)
  }

  return response
}

// export async function changeUserPasswordAPI(sellerId: string, oldPassword: string, newPassword: string) {
//   const response = await axios.patch(
//     `/api/seller/${sellerId}/change-password`, { oldPassword, newPassword },
//     { withCredentials: true }
//   )

//   if (response.status >= 400) {
//     alert(response.data.error)
//     throw new Error(response.data.error)
//   }

//   return response
// }


export async function deleteSellerAPI(sellerId: string) {
  const response = await axios.delete(`/api/seller/${sellerId}`, { withCredentials: true })

  if (response.status >= 400) {
    alert(response.data.error)
    throw new Error(response.data.error)
  }

  return response
}  

export async function blockSellerAPI(sellerId: string) {
  const response = await axios.patch(`/api/seller/${sellerId}/block`, {},
    { withCredentials: true }
  )

  if (response.status >= 400) {
    alert(response.data.error)
    throw new Error(response.data.error)
  }

  return response
}

export async function unblockSellerAPI(sellerId: string) {
  const response = await axios.patch(`/api/seller/${sellerId}/unblock`, {},
    { withCredentials: true }
  )

  if (response.status >= 400) {
    alert(response.data.error)
    throw new Error(response.data.error)
  }

  return response
}
