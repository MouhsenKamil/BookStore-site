import axios, { AxiosResponse } from "axios"


export async function getWishlistOfUserAPI(
  options?: { userId?: string }
): Promise<AxiosResponse> {
  const { userId = "@me" } = options || {}

  const response = await axios.get(
    `/api/customer/${userId}/wishlist/`, { withCredentials: true }
  )

  if (response.status >= 400) {
    alert(response.data.error)
    throw new Error(response.data.error)
  }

  return response
}

export async function addBookToWishlistAPI(
  bookId: string, options?: { userId?: string }
): Promise<AxiosResponse> {
  const { userId = "@me" } = options || {}

  const response = await axios.post(
    `/api/customer/${userId}/wishlist/add`, { bookId }, { withCredentials: true }
  )

  if (response.status >= 400) {
    alert(response.data.error)
    throw new Error(response.data.error)
  }

  return response
}

export async function removeBookFromWishlistAPI(
  bookId: string, options?: { userId?: string }
): Promise<AxiosResponse> {
  const { userId = "@me" } = options || {}

  const response = await axios.patch(
    `/api/customer/${userId}/wishlist/delete`, { bookId }, { withCredentials: true }
  )

  if (response.status >= 400) {
    alert(response.data.error)
    throw new Error(response.data.error)
  }

  return response
}

export async function clearWishlistAPI(options: { userId?: string }): Promise<AxiosResponse> {
  const { userId = "@me" } = options || {}

  const response = await axios.delete(
    `/api/customer/${userId}/wishlist/clear`, { withCredentials: true }
  )

  if (response.status >= 400) {
    alert(response.data.error)
    throw new Error(response.data.error)
  }

  return response
}
