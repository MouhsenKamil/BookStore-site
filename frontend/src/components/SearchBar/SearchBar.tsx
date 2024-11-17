import { useEffect, useState, useRef } from "react"
import { useNavigate } from "react-router-dom"
import axios from "axios"

import { IBookWithSellerName } from "../../../../backend/src/models/Book.tsx"

import './SearchBar.css'
import CoverImage from "../CoverImage/CoverImage.tsx"


// interface SearchResultItemProps {
//   data: IBookWithSellerName[]
//   index: number
//   style: React.CSSProperties
// }


// function SearchResultItem(props: SearchResultItemProps) {
function SearchResultItem({ book }: { book: IBookWithSellerName }) {
  const navigate = useNavigate()
  // let description = book.description ?? ''

  // if (description.length > 150)
  //   description = description.substring(0, 150)

  return (
    <div className="search-result-item" onClick={() => {
      navigate(`/book/${book._id}`)
    }}>
      <CoverImage className="cover-image" src={`/api/static${book.coverImage}`} alt={book.title} />
      <div className="metadata">
        <h4 className="heading book-title">{book.title}</h4>
        {book.subtitle && <h6 className="heading book-subtitle">{book.subtitle}</h6>}
        <span className="author">
          Author: {book.authorName ? <b>{book.authorName}</b> : '---'} {book.sellerName}
        </span>
        {/* {description && <span className="description">{description}</span>} */}
      </div>
    </div>
  )
}


export function SearchBar() {
  const resultsListRef = useRef<HTMLDivElement>(null)
  const [showSearchResults, setShowSearchResults] = useState(false)
  const [books, setBooks] = useState<IBookWithSellerName[]>([])
  const [searchTerm, setSearchTerm] = useState('')

  async function fetchBooks(query: string = '') {
    if (!query) {
      setBooks([])
      return
    }

    try {
      const response = await axios.get(`/api/books`, {
        params: {
          query,
          limit: 8,
          fields: ['_id', 'title', 'subtitle', 'coverImage', 'authorName']
        }
      })

      setBooks(response.data.results)
    } catch (error) {
      console.error('Failed to fetch books:', error)
    }
  }

  function handleSearchChange(e: React.ChangeEvent<HTMLInputElement>) {
    const value = e.target.value
    setSearchTerm(value)
    fetchBooks(value)
    if (!showSearchResults) setShowSearchResults(true)
  }

  useEffect(() => {
    console.log('rendering search results')
    if (!books.length) fetchBooks()

    function closeSearchResultsAtOutsideClick(e: MouseEvent) {
      // console.log('clicking outside', showSearchResults, books.length)
      if (showSearchResults && !resultsListRef.current?.contains(e.target as Node))
        setShowSearchResults(false)
      else
        console.log(resultsListRef.current?.contains(e.target as Node))
    }

    document.addEventListener("mousedown", closeSearchResultsAtOutsideClick)
    // const listener = () => {
    //   console.log("clicked ", showSearchResults)
    // }
    // document.addEventListener("mousedown", listener)

    return () => {
      document.removeEventListener("mousedown", closeSearchResultsAtOutsideClick)
      // document.removeEventListener("mousedown", listener)
    }
  }, [])

  return (
    <div className="search-bar-container" ref={resultsListRef}>
      <input
        className='search-bar'
        type="text"
        placeholder="Search Books..."
        value={searchTerm}
        onChange={handleSearchChange}
        onClick={() => { setShowSearchResults(true) }}
        // onFocus={() => setShowSearchResults(true)}
        // onBlur={() => setShowSearchResults(false)}
      />
      {/* {showSearchResults ? 'hi': 'hello'} */}
      {showSearchResults && 
        <div className="search-results-list">
          {(books.map((book, key) => <SearchResultItem book={book} key={key} />))}
        </div>
      }
    </div>
  )
}
