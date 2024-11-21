import axios, { AxiosResponse } from "axios"


export async function getWishlistOfUserAPI(
  options?: { userId?: string }
): Promise<AxiosResponse> {

  let { userId = "@me" } = options || {}

  return await axios.get(
    `/api/customer/${userId}/wishlist/`, { withCredentials: true }
  )
}

export async function addBookToWishlistAPI(
  bookId: string, options?: { userId?: string }
): Promise<AxiosResponse> {
  let { userId = "@me" } = options || {}

  return await axios.post(
    `/api/customer/${userId}/wishlist/add`, { bookId }, { withCredentials: true }
  )
}

export async function removeBookFromWishlistAPI(
  bookId: string, options?: { userId?: string }
): Promise<AxiosResponse> {
  let { userId = "@me" } = options || {}

  return await axios.patch(
    `/api/customer/${userId}/wishlist/delete`, { bookId }, { withCredentials: true }
  )
}

export async function clearWishlistAPI(options: { userId?: string }): Promise<AxiosResponse> {
  let { userId = "@me" } = options || {}

  return await axios.delete(
    `/api/customer/${userId}/wishlist/clear`, { withCredentials: true }
  )
}
