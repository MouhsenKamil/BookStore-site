import axios, { AxiosResponse } from "axios"


export async function getWishlistOfUser(
  options?: { userId?: string }
): Promise<AxiosResponse> {

  let { userId = "@me" } = options || {}

  return await axios.get(
    `/api/customer/${userId}/wishlist/`, { withCredentials: true }
  )
}

export async function addBookToWishlist(
  bookId: string, options?: { quantity?: number, userId?: string }
): Promise<AxiosResponse> {
  let { quantity = 1, userId = "@me" } = options || {}

  return await axios.post(
    `/api/customer/${userId}/wishlist/add`, { bookId, quantity }, { withCredentials: true }
  )
}

export async function removeBookFromWishlist(
  bookId: string, options?: { userId?: string }
): Promise<AxiosResponse> {
  let { userId = "@me" } = options || {}

  return await axios.patch(
    `/api/customer/${userId}/wishlist/delete`, { bookId }, { withCredentials: true }
  )
}

export async function clearWishlist(options: { userId?: string }): Promise<AxiosResponse> {
  let { userId = "@me" } = options || {}

  return await axios.delete(
    `/api/customer/${userId}/wishlist/clear`, { withCredentials: true }
  )
}
