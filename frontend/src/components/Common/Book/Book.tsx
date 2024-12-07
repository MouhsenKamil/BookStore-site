import { Link, useLocation, useNavigate, useParams } from "react-router-dom"
import { useState, MouseEvent, useEffect } from "react"
import axios, { AxiosError } from "axios"

import languages from "../../../public/languages-iso-639-2.json"
import { IBookWithSellerName } from "../../../types/book"
import CoverImage from "../CoverImage/CoverImage"

import { toTitleCase } from "../../../utils/stringUtils"

import IntInput from "../IntInput/IntInput"

import './Book.css'
import { useAuth } from "../../../hooks/useAuth"


type bookStateType = IBookWithSellerName & { error?: string }

interface TagsProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string
  items: string[]
}


function TagsList(props: TagsProps) {
  const { title, items, className = '', ...otherProps } = props

  if (!items || !items.length)
    return <></>

  return (
    <div className={"tags-list " + className} {...otherProps}>
      <span className="tags-title">{title} </span>{(
        items.map((item, key) => 
          <span key={key} className="tags-item">{toTitleCase(item)}</span>
      ))}
    </div>
  )
}


export default function Book() {
  const { user } = useAuth().authState
  const { bookId } = useParams()
  const navigate = useNavigate()
  const location = useLocation()
  const [book, setBook] = useState<bookStateType>({} as IBookWithSellerName)
  const [quantity, setQuantity] = useState(1)

  if (!bookId || bookId === "undefined") {
    navigate('/')
    return
  }

  useEffect(() => {
    async function getBook(bookId: string) {
      try {
        const response = await axios.get(`/api/books/${bookId}`)
        if (response.status !== 200)
          throw new Error(response.data.error)
  
        setBook(response.data)
      } catch (e) {
        console.error(e)
      }
    }

    getBook(bookId)
  }, [bookId])

  if (book.error)
    return <><h1>Book not found</h1><Link to='/'>Return to Home</Link></>

  const onAddToCart = async (_: MouseEvent<HTMLButtonElement>) => {
    try { 
      const response = await axios.post(
        '/api/customer/@me/cart/add', { bookId, quantity }, { withCredentials: true }
      )

      if (response.status !== 201)
        throw new Error(response.data.error)

    } catch (err) {
      if ((err as AxiosError).response?.status === 401) {
        navigate('/account/user/login?from=' + location.pathname)
        return
      }

      alert((err as Error).message)
    }
  }

  const onAddToWishlist = async (_: MouseEvent<HTMLButtonElement>) => {
    try {
      const response = await axios.post(
        '/api/customer/@me/wishlist/add', { bookId }, { withCredentials: true }
      )

      if (response.status !== 201)
        throw new Error(response.data.error)

    } catch (err) {
      if ((err as AxiosError).response?.status === 401) {
        navigate('/account/user/login?from=' + location.pathname)
        return
      }
  
      alert((err as Error).message)
    }
  }

  const onBuy = async (_: MouseEvent<HTMLButtonElement>) =>  {
    try {
      navigate(`/user/checkout?method=bookOnly&bookId=${bookId}&quantity=${quantity}`)
    } catch (err) {
      if ((err as AxiosError).response?.status === 401) {
        navigate('/account/user/login?from=' + location.pathname)
        return
      }

      alert((err as Error).message)
    }
  }

  const onDelete = async (_: MouseEvent<HTMLElement>) => {
    try {
      const response = await axios.delete(`/api/books/${bookId}`, { withCredentials: true })
      if (response.status !== 204)
        throw new Error(response.data.error)

      alert('Book has been deleted successfully')
      navigate("/")
    } catch (err) {
      console.error(err)
      alert(err)
    }
  }

  return (
    <div className="book-display">
      <CoverImage coverImg={book.coverImage} alt={book.title} />

      <div className="book-info">
        <h1 className="book-title">{book.title}</h1>
        {book.subtitle && <h5 className="book-subtitle">{book.subtitle}</h5>}

        <TagsList className="authors-publishers" title="Authors and Publishers" items={book.authorNames} />
        <TagsList className="categories" title='Categories' items={book.categories} />

        <TagsList className="languages" title="Languages" items={
          (book.lang || []).map(langCode => {
            const langObj = languages.find(elem => elem.code === langCode)
            return langObj?.english.at(0) ?? langCode
          })}
        />

        {book.description && <p className="book-desc">
          <h4>Description</h4>
          {book.description.trim().split(/(?:\r?\n\s*)+/).map(
            paragraph => <p>{paragraph}</p>
          )}
        </p>}

        <p><b>Seller: </b>{book.sellerName}</p>
        <>
          ₹ <h2 style={{display: "inline", color: 'orange'}}>
            {book.price ? book.price.toFixed(2) : '---'}
          </h2>
        </>

        {book.unitsInStock
          ? <p className="stock-count">
            <span className="pass-item">In Stock: </span>
            <span>{book.unitsInStock}</span>
          </p>
          : <p className="stock-count"><span style={{color: "red"}}>Sold Out!</span></p>
        }
        {/* 
        <label className="quantity-input">
          Quantity: 
          <input
            type="number" id="quantity" name='quantity' required min={0}
            max={book.unitsInStock} value={1}
          />
        </label>

        {errors.quantity && <p className="err-msg">{errors.quantity.message}</p>} */}

        <IntInput text="Quantity: " min={1} max={book.unitsInStock}
          onValChange={val => { setQuantity(val) }}
         />

        { (user?.type !== 'seller') &&
          <div className="book-actions">
            <button title="Add to Wishlist" onClick={onAddToWishlist}>Add to Wishlist ⭐</button>
            <button title="Add to Cart" onClick={onAddToCart}>Add to Cart 🛒</button>
            {(user?.type === 'customer') && <button title="Buy" onClick={onBuy}>Buy Now</button>}
            {(user?.type === 'admin') && <button title="Delete" onClick={onDelete}>Delete</button>}
          </div>
        }
      </div>
    </div>
  )
}
