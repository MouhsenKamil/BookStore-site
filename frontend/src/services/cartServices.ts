import axios, { AxiosResponse } from "axios"


export async function getCartOfUser(
  options?: { userId?: string }
): Promise<AxiosResponse> {

  let { userId = "@me" } = options || {}

  return await axios.get(
    `/api/customer/${userId}/cart/`, { withCredentials: true }
  )
}


export async function addBookToCart(
  bookId: string, options?: { quantity?: number, userId?: string }
): Promise<AxiosResponse> {
  let { quantity = 1, userId = "@me" } = options || {}

  return await axios.post(
    `/api/customer/${userId}/cart/add`, { bookId, quantity }, { withCredentials: true }
  )
}

export async function removeBookFromCart(
  bookId: string, options?: { userId?: string }
): Promise<AxiosResponse> {
  let { userId = "@me" } = options || {}

  return await axios.patch(
    `/api/customer/${userId}/cart/delete`, { bookId }, { withCredentials: true }
  )
}

export async function clearCart(options: { userId?: string }): Promise<AxiosResponse> {
  let { userId = "@me" } = options || {}

  return await axios.delete(
    `/api/customer/${userId}/cart/clear`, { withCredentials: true }
  )
}

export async function checkout(options: { userId?: string }): Promise<AxiosResponse> {
  let { userId = "@me" } = options || {}

  return await axios.post(
    `/api/customer/${userId}/cart/checkout`, { withCredentials: true }
  )
}
