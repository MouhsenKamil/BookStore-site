import { useEffect, useState, useRef } from "react"
import { useNavigate } from "react-router-dom"
import axios from "axios"

import { IBookWithSellerName } from "../../types/book.tsx"
import CoverImage from "../CoverImage/CoverImage.tsx"

import './SearchBar.css'


export function SearchBar() {
  const resultsListRef = useRef<HTMLDivElement>(null)
  const searchBarRef = useRef<HTMLInputElement>(null)
  const [showSearchResults, setShowSearchResults] = useState(false)
  const [books, setBooks] = useState<IBookWithSellerName[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const navigate = useNavigate()


  function SearchResultItem({ book }: { book: IBookWithSellerName }) {
  
    return (
      <div className="search-result-item" onClick={() => {
        setShowSearchResults(false)
        setSearchTerm('')
        navigate(`/book/${book._id}`)
      }}>
        <CoverImage className="cover-image" coverImg={book.coverImage} alt={book.title} />
        <div className="metadata">
          <h4 className="heading book-title">{book.title}</h4>
          {book.subtitle && <h6 className="heading book-subtitle">{book.subtitle}</h6>}
          <span className="author">
            {book.authorNames && <>by <b>{book.authorNames.join(',')}</b></>}
          </span>
        </div>
      </div>
    )
  }

  async function fetchBooks(query: string = '') {
    if (!query) {
      setBooks([])
      return
    }

    try {
      let fields = ['_id', 'title', 'subtitle']
      if (window.screen.width > 600)
        fields.push('coverImage', 'authorName')

      const response = await axios.get(`/api/books`, {
        params: { query, limit: 8, fields }
      })

      setBooks(response.data.results)
    } catch (error) {
      console.error(error)
    }
  }

  function handleSearchChange(e: React.ChangeEvent<HTMLInputElement>) {
    const value = e.target.value
    setSearchTerm(value)
    fetchBooks(value)
    if (!showSearchResults) setShowSearchResults(true)
  }

  useEffect(() => {
    if (!books.length) fetchBooks()

    function closeSearchResultsAtOutsideClick(e: MouseEvent) {
      if (
        showSearchResults &&
        resultsListRef.current &&
        !resultsListRef.current?.contains(e.target as Node)
      )
        setShowSearchResults(false)
    }

    function submitOnEnter(e: KeyboardEvent) {
      if (e.target && e.target !== searchBarRef.current) return
      if (e.key !== "Enter") return

      e.preventDefault()
      navigate('/search?query=' + (e.target as HTMLInputElement).value)
    }

    document.addEventListener("mousedown", closeSearchResultsAtOutsideClick)
    document.addEventListener("keypress", submitOnEnter)
    return () => {
      document.removeEventListener("mousedown", closeSearchResultsAtOutsideClick)
      document.removeEventListener("keypress", submitOnEnter)
    }
  }, [])

  return (
    <div className="search-bar-container" ref={resultsListRef}>
      <input
        className='search-bar' id='search-bar' type="text" placeholder="Search Books..."
        value={searchTerm} onChange={handleSearchChange} ref={searchBarRef}
        onClick={() => { setShowSearchResults(true) }}
        // onFocus={() => setShowSearchResults(true)}
        // onBlur={() => setShowSearchResults(false)}
      />
      {showSearchResults && <div className="search-results-list">
        {(books.map((book, key) => <SearchResultItem book={book} key={key} />))}
      </div>}
    </div>
  )
}
