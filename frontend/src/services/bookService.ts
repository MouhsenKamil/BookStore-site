import axios from 'axios'

const API_URL = '/api/books/'

export const getBooks = async () => {
  const response = await axios.get(API_URL)
  return response.data
}

export const getBookById = async (id: string) => {
  const response = await axios.get(`${API_URL}${id}`)
  return response.data
}

export const createBook = async (bookData: any) => {
  const response = await axios.post(API_URL, bookData)
  return response.data
}

export const updateBook = async (id: string, bookData: any) => {
  const response = await axios.put(`${API_URL}${id}`, bookData)
  return response.data
}

export const deleteBook = async (id: string) => {
  const response = await axios.delete(`${API_URL}${id}`)
  return response.data
}
