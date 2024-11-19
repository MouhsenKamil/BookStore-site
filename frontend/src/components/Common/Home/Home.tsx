import { useState, useEffect } from "react"
import axios from "axios"

import BookCard from "../BookCard/BookCard"

import './Home.css'


export default function Home() {
  const [newBooks, setNewBooks] = useState([])
  const [lowStockBooks, setLowStockBooks] = useState([])
  const [scienceFictionBooks, setScienceFictionBooks] = useState([])
  const [literatureBooks, setLiteratureBooks] = useState([])

  async function fetchBooks(query: string = "", params: { [key: string]: any } = {}) {
    try {
      const response = await axios.get(`/api/books`, {
        params: {
          query,
          fields: ["_id", "title", "coverImage", "price"],
          ...params,
        }
      })

      return response.data.results
    } catch (error) {
      console.error(error)
      return []
    }
  }

  async function loadBooks() {
    const [newListings, lowStock, scienceFiction, literature] = await Promise.all([
      fetchBooks('', { sort: 'createdAt', limit: 16 }),
      fetchBooks('', {
        fields: ['_id', 'title', 'coverImage', 'unitsInStock'],
        sort: 'unitsInStock',
        limit: 16,
        order: 'asc'
      }),
      fetchBooks('', { categories: ['Science Fiction'], limit: 16 }),
      fetchBooks('', { categories: ['Literature'], limit: 16 }),
    ])

    setNewBooks(newListings)
    setLowStockBooks(lowStock)
    setScienceFictionBooks(scienceFiction)
    setLiteratureBooks(literature)
  }

  useEffect(() => {
    loadBooks()
  }, [])

  return (
    <div className="home-page">
      {newBooks.length > 0 && <>
        <h2 className="book-suggestions-title">New Listings</h2>
        <div className="book-list new-listing-books">{
          newBooks.map((book: any, key: number) => <BookCard key={key} book={book} />)
        }
        </div>
      </>}
      {lowStockBooks.length > 0 && <>
        <h2 className="book-suggestions-title">Low on Stock (Get 'em Soon!)</h2>
        <div className="book-list low-on-stock-books">{
          lowStockBooks.map((book: any, key: number) => (
            <BookCard key={key} book={book} />
          ))}
        </div>
      </>}
      {scienceFictionBooks.length > 0 && <>
        <h2 className="book-suggestions-title">Science Fiction</h2>
        <div className="book-list science-fiction-books">{
          scienceFictionBooks.map((book: any, key: number) => (
            <BookCard key={key} book={book} />
          ))}
        </div>
      </>}
      {literatureBooks.length > 0 && <>
        <h2 className="book-suggestions-title">Literature</h2>
        <div className="book-list literature-books">
          {
          literatureBooks.map((book: any, key: number) => (
            <BookCard key={key} book={book} />
          ))}
        </div>
      </>}
    </div>
  )
}
