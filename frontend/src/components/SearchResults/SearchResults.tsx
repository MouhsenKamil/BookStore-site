import { useSearchParams } from 'react-router-dom'

import './SearchResults.css'
import { useEffect, useState } from 'react'
import axios from 'axios'
import { IBookWithSellerName } from '../../types/book'
import BookCard from '../BookCard/BookCard'


interface SearchResultsQuery {
  query: string
  sort?: string
  order?: 'asc' | "desc"
  fields: string[]
  limit: number
  sellerName: string
  [key: string]: any
}


export default function SearchResults() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [booksResult, setBooksResult] = useState<IBookWithSellerName[]>([])
  const [searchErr, setSearchErr] = useState('')

  console.log(JSON.stringify(searchParams))

  // async function fetchBooks() {
  //   try {
  //     const response = await axios.get(`/api/books`, {
  //       params: searchParams
  //     })
  //     setBooksResult(response.data.results)
  //   } catch (error) {
  //     console.error(error)
  //     return []
  //   }
  // }

  // useEffect(() => {
  //   fetchBooks()
  // }, [])

  return (
    <div className='search-results-container'>
      <h3>{booksResult.length} search results found for {searchParams.get('query')}</h3>
      {searchErr && <div className='form-heading'>No</div>}
      {(!searchErr && booksResult.length === 0)
        ? <div className='form-heading'>Try Searching again...</div>
        : <div className='results-list'>
          {(booksResult.map((book, key) => <BookCard key={key} book={book} />))}
        </div>
      }
    </div>
  )
}
