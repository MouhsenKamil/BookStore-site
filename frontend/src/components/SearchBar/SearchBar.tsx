import { useEffect, useState, useRef } from "react";
import axios from "axios"

import { IBookWithSellerName } from "../../../../backend/src/models/Book.tsx"

import './SearchBar.css'


interface SearchResultItem {
  book: IBookWithSellerName
}


function SearchResultItem(props: SearchResultItem) {
  const { book } = props
  let description = book.description ?? 'No description'

  if (description.length > 150)
    description = description.substring(0, 150)

  let imgUrl = book.coverImage ? `/api/static${book.coverImage}` : 'src/assets/cover-image-placeholder.png'

  return (
    <div className="search-result-item">
      <img className="cover-image" src={imgUrl} alt={book.title} />
      <div className="metadata">
        <h4 className="book-title">{book.title}</h4>
        {book.subtitle && <h6 className="book-subtitle">{book.subtitle}</h6>}
        <div className="sub-metadata">
          <span className="author">Author: {book.authorName ? <b>{book.authorName}</b> : '---'} {book.sellerName}</span>
          <span className="price"><b>₹{book.price}</b></span>
        </div>
        <span className="description">{description}</span>
        {/* {book.subject && <div className="categories">{
          book.subject.map((value, _) => <span className="category">{value}</span>)
        }</div>} */}
      </div>
    </div>
  )
}


export function SearchBar() {
  const resultsListRef = useRef<HTMLDivElement>(null)
  const [showSearchResults, setShowSearchResults] = useState(false)
  const [books, setBooks] = useState<IBookWithSellerName[]>([])
  const [searchTerm, setSearchTerm] = useState('')

  const fetchBooks = async (query: string = '') => {
    if (!query) {
      setBooks([])
      return
    }

    try {
      const response = await axios.get(`/api/books`, {
        params: {
          query,
          limit: 8,
          fields: ['title', 'subtitle', 'description', 'coverImage', 'authorName', 'price']
        }
      })

      setBooks(response.data)
    } catch (error) {
      console.error('Failed to fetch books:', error)
    }
  }

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setSearchTerm(value)
    fetchBooks(value)
  }

  function closeSearchResultsAtOutsideClick(e: MouseEvent) {
    if (showSearchResults && !resultsListRef.current?.contains(e.target as HTMLDivElement))
      setShowSearchResults(false)
  }

  useEffect(() => {
    // console.log('rendering search results')
    if (!books) fetchBooks()
    document.addEventListener("mousedown", closeSearchResultsAtOutsideClick)

    return () => {
      document.removeEventListener("mousedown", closeSearchResultsAtOutsideClick)
    }
  })

  return (
    <div className="search-bar-container" ref={resultsListRef}>
      <input
        className='search-bar'
        type="text"
        placeholder="Search Books..."
        value={searchTerm}
        onChange={handleSearchChange}
        onClick={() => {
          if (books) setShowSearchResults(true)
        }}
      />
      {showSearchResults && books &&
        <div className="search-results-list">
          {(books.map((book, key) => <SearchResultItem book={book} key={key} />))}
        </div>
      }
    </div>
  )
}
