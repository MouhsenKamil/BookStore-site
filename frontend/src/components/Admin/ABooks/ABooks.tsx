import { useEffect, useState } from "react"
import axios, { AxiosError } from "axios"

import { IBook } from "../../../types/book"


export default function ABooks() {
  const [books, setBooks] = useState<IBook[]>([])

  useEffect(() => {
    async function fetchBooks() {
      try {
        const response = await axios.get("/api/admin/analytics", { withCredentials: true })
        if (response.status !== 200)
          throw new Error(response.data.error)

        setBooks(response.data.totalBooks.concat(response.data.totalBooksSold))
      } catch (error) {
        console.error(error)
        alert((error as AxiosError).response?.data?.error || error)
      }
    }

    fetchBooks()
  }, [])

  async function deleteBook(bookId: string) {
    try {
      const response = await axios.delete(`/api/books/${bookId}`)
      if (response.status === 200) {
        alert("Book deleted successfully!")
        setBooks(books.filter(book => book._id !== bookId))
      } else {
        alert("Failed to delete the book.")
      }
    } catch (error) {
      console.error("Error deleting book:", error)
      alert("An error occurred while deleting the book.")
    }
  }

  console.log(JSON.stringify(books[0]))

  return (
    <>
      <h1>Book List</h1>
      <div className="book-list">
        {books.length > 0 ? (
          <p>No books available.</p>
        ) : (
          <ul>
            {(books.map(book => (
              <li key={book._id} className="book-item">
                <p>
                  <b>{book.title}</b> - {book.authorNames}
                  <b>Units in Stock:</b> {book.unitsInStock}
                </p>
                <button onClick={() => deleteBook(book._id as string)}>Delete</button>
              </li>
            )))}
          </ul>
        )}
      </div>
    </>
  )
}
