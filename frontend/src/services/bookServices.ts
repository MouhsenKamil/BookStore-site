import axios from "axios"

import { IBook } from "../types/book"
import { GetSearchResultsProps } from "../types/commonTypes"


const BOOKS_API_URL = '/api/books/'


interface GetBooksSearchResultsProps extends GetSearchResultsProps<IBook> {
  subtitle?: string
  lang?: string[]
  categories?: string[]
  minPrice?: number
  maxPrice?: number
  sellerName?: string
}


export async function getBookByIdAPI(bookId: string) {
  const response = await axios.get(`${BOOKS_API_URL}${bookId}`)

  if (response.status >= 400) {
    alert(response.data.error)
    throw new Error(response.data.error)
  }

  return response
}

export async function updateBookAPI(bookId: string, data: Partial<Omit<IBook, '_id'>>) {
  const response = await axios.patch(
    `${BOOKS_API_URL}${bookId}`, data, { withCredentials: true }
  )
  
  if (response.status >= 400) {
    alert(response.data.error)
    throw new Error(response.data.error)
  }

  return response
}

export async function deleteBookAPI(bookId: string) {
  const response = await axios.delete(
    `${BOOKS_API_URL}${bookId}`, { withCredentials: true }
  )

  if (response.status >= 400) {
    alert(response.data.error)
    throw new Error(response.data.error)
  }

  return response
}

export async function getBooksAPI(props?: GetBooksSearchResultsProps) {
  const {
    query = '', limit = 1, sort = 'title', order = 'asc', fields = [
      '_id', 'authorNames', 'categories', 'coverImage', 'price', 'quantity',
      'subtitle', 'title', 'unitsInStock'
    ]
  } = props || {}

  const response = await axios.get(BOOKS_API_URL, {
    params: { ...props, query, limit, sort, order, fields }
  })


  if (response.status >= 400) {
    alert(response.data.error)
    throw new Error(response.data.error)
  }

  return response
}

export async function getCategoriesAPI(props?: { query: string, limit: number }) {
  const { query = '', limit = 1 } = props || {}
  const response = await axios.get(
    `${BOOKS_API_URL}categories`, { params: { query, limit } }
  )

  if (response.status >= 400) {
    alert(response.data.error)
    throw new Error(response.data.error)
  }

  return response
}

export async function getLanguagesAPI(props?: { query: string, limit: number }) {
  const { query = '', limit = 1 } = props || {}
  const response = await axios.get(`${BOOKS_API_URL}langs`, { params: { query, limit } })

  if (response.status >= 400) {
    alert(response.data.error)
    throw new Error(response.data.error)
  }

  return response
}

export async function getAuthorNamesAPI(props?: { query: string, limit: number }) {
  const { query = '', limit = 1 } = props || {}
  const response = await axios.get(`${BOOKS_API_URL}author`, { params: { query, limit } })

  if (response.status >= 400) {
    alert(response.data.error)
    throw new Error(response.data.error)
  }

  return response
}
