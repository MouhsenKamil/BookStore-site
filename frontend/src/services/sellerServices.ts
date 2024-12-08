import axios from "axios"

import { GetSearchResultsProps } from "../types/commonTypes"
import { IBlockableUser } from "../types/user"
import { ISeller } from "../types/seller"


const SELLER_API_URL = "/api/seller/"

export async function getSellersAPI(props?: GetSearchResultsProps<IBlockableUser>) {
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
  const response = await axios.get(`${SELLER_API_URL}${sellerId}`, { withCredentials: true })

  if (response.status >= 400) {
    alert(response.data.error)
    throw new Error(response.data.error)
  }

  return response
}


export async function updateSellerAPI(sellerId: string, data: Partial<ISeller>) {
  const response = await axios.patch(`${SELLER_API_URL}${sellerId}`, data, {
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
//     `${SELLER_API_URL}${sellerId}/change-password`, { oldPassword, newPassword },
//     { withCredentials: true }
//   )

//   if (response.status >= 400) {
//     alert(response.data.error)
//     throw new Error(response.data.error)
//   }

//   return response
// }


export async function deleteSellerAPI(sellerId: string) {
  const response = await axios.delete(`${SELLER_API_URL}${sellerId}`, { withCredentials: true })

  if (response.status >= 400) {
    alert(response.data.error)
    throw new Error(response.data.error)
  }

  return response
}  

export async function blockSellerAPI(sellerId: string) {
  const response = await axios.patch(`${SELLER_API_URL}${sellerId}/block`, {},
    { withCredentials: true }
  )

  if (response.status >= 400) {
    alert(response.data.error)
    throw new Error(response.data.error)
  }

  return response
}

export async function unblockSellerAPI(sellerId: string) {
  const response = await axios.patch(`${SELLER_API_URL}${sellerId}/unblock`, {},
    { withCredentials: true }
  )

  if (response.status >= 400) {
    alert(response.data.error)
    throw new Error(response.data.error)
  }

  return response
}
