import axios, { AxiosResponse } from "axios"


export async function getCartOfUserAPI(
  options?: { userId?: string }
): Promise<AxiosResponse> {
  let { userId = "@me" } = options || {}

  return await axios.get(
    `/api/customer/${userId}/cart/`, { withCredentials: true }
  )
}


export async function addBookToCartAPI(
  bookId: string, options?: { quantity?: number, userId?: string }
): Promise<AxiosResponse> {
  let { quantity = 1, userId = "@me" } = options || {}

  return await axios.post(
    `/api/customer/${userId}/cart/add`, { bookId, quantity }, { withCredentials: true }
  )
}


export async function removeBookFromCartAPI(
  bookId: string, options?: { userId?: string }
): Promise<AxiosResponse> {
  let { userId = "@me" } = options || {}

  return await axios.patch(
    `/api/customer/${userId}/cart/delete`, { bookId }, { withCredentials: true }
  )
}


export async function clearCartAPI(options?: { userId?: string }): Promise<AxiosResponse> {
  let { userId = "@me" } = options || {}

  return await axios.delete(
    `/api/customer/${userId}/cart/clear`, { withCredentials: true }
  )
}


export async function checkoutAPI(options?: { userId?: string }): Promise<AxiosResponse> {
  let { userId = "@me" } = options || {}

  return await axios.post(
    `/api/customer/${userId}/cart/checkout`, { withCredentials: true }
  )
}
