import axios from "axios"


export async function getCartOfUserAPI(options?: { userId?: string }) {
  const { userId = "@me" } = options || {}

  const response = await axios.get(
    `/api/customer/${userId}/cart/`, { withCredentials: true }
  )

  if (response.status >= 400) {
    alert(response.data.error)
    throw new Error(response.data.error)
  }

  return response
}


export async function addBookToCartAPI(
  bookId: string, options?: { quantity?: number, userId?: string }
) {
  const { quantity = 1, userId = "@me" } = options || {}

  const response = await axios.post(
    `/api/customer/${userId}/cart/add`, { bookId, quantity }, { withCredentials: true }
  )

  if (response.status >= 400) {
    alert(response.data.error)
    throw new Error(response.data.error)
  }

  return response
}


export async function removeBookFromCartAPI(bookId: string, options?: { userId?: string }) {
  const { userId = "@me" } = options || {}

  const response = await axios.patch(
    `/api/customer/${userId}/cart/delete`, { bookId }, { withCredentials: true }
  )

  if (response.status >= 400) {
    alert(response.data.error)
    throw new Error(response.data.error)
  }

  return response
}


export async function clearCartAPI(options?: { userId?: string }) {
  const { userId = "@me" } = options || {}

  const response = await axios.delete(
    `/api/customer/${userId}/cart/clear`, { withCredentials: true }
  )

  if (response.status >= 400) {
    alert(response.data.error)
    throw new Error(response.data.error)
  }

  return response
}


export async function checkoutAPI(options?: { userId?: string }) {
  const { userId = "@me" } = options || {}

  const response =  await axios.post(
    `/api/customer/${userId}/cart/checkout`, { withCredentials: true }
  )

  if (response.status >= 400) {
    alert(response.data.error)
    throw new Error(response.data.error)
  }

  return response
}
