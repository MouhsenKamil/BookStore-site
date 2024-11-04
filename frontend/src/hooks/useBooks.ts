import { useEffect, useState } from 'react'
import { getBooks } from '../services/bookService'
import { IBook } from '../types/book.tsx'


const useBooks = () => {
  const [books, setBooks] = useState<IBook[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const data = await getBooks()
        setBooks(data)
      } catch (err) {
        setError('Failed to fetch books')
      } finally {
        setLoading(false)
      }
    }

    fetchBooks()
  }, [])

  return { books, loading, error }
}

export default useBooks
