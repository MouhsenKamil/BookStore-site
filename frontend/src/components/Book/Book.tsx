import { Link, useNavigate, useParams } from "react-router-dom"
import { useForm } from "react-hook-form"
import { useState, MouseEvent, useEffect } from "react"
import axios from "axios"

import { IBookWithSellerName } from "../../types/book"

import './Book.css'


type bookStateType = IBookWithSellerName & Partial<{ error: string }>


export default function Book() {
  const { bookId } = useParams()

  const navigate = useNavigate()
  const { register, handleSubmit, getValues, formState: { errors } } = useForm<{quantity: number}>()

  if (!bookId || bookId === "undefined") {
    navigate('/')
    return
  }

  const [book, setBook] = useState<bookStateType>({} as IBookWithSellerName)

  async function getBook(bookId: string) {
    try {
      const response = await axios.get(`/api/books/${bookId}`)
      console.log(response)
      if (response.status === 200)
        setBook(response.data)
    } catch (e) {
      console.error(e)
    }
  }

  useEffect(() => {
    if (bookId)
      getBook(bookId)
  }, [bookId])

  if (book.error)
    return <><h1>Book not found</h1><Link to='/'>Return to Home</Link></>

  const onAddToCart = async (_: MouseEvent<HTMLButtonElement>) => {
    const response = await axios.post('/api/customers/@me/cart/add', {
      bookId: book._id, quantity: getValues('quantity')
    })

    let messsage = (response.status === 201)
        ? 'Book is now added to the cart'
        : response.data.messsage

    alert(messsage)
  }

  const onAddToWishlist = async (_: MouseEvent<HTMLButtonElement>) => {
    const response = await axios.post('/api/customers/@me/wishlist/add', {
      bookId: book._id
    })

    let messsage = (response.status === 201)
        ? 'Book is added to the Wishlist'
        : response.data.messsage

    alert(messsage)
  }

  async function onSubmit(data: { quantity: number }) {
    try {
      const response = await axios.post(`/api/book/${book._id}/purchase`, data)

      if (response.status !== 201)
        throw new Error("Failed to send purchase request")

      navigate(
        `/user/checkout?method=bookOnly&bookId=${bookId}&quantity=${data.quantity}`
      )
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <form className="book-display" onSubmit={handleSubmit(onSubmit)}>
      <img
        src={book.coverImage
          ? `/api/static${book.coverImage}`
          : 'src/assets/cover-image-placeholder.png'}
        alt={book.title}
        onClick={() => {
          navigate(`/book/${book._id}`)
        }}
      />

      <div className="book-info">
        <h3 className="book-title">{book.title}</h3>
        {book.subtitle && <h5>{book.subtitle}</h5>}

        <span>by <b>{book.authorName}</b></span>
        <span>₹{book.price ? book.price.toFixed(2) : '---'}</span>

        <span><b>Seller: </b>{book.sellerName}</span>

        {book.categories.length && (
          <div className="book-categories">{(
            book.categories.map(category => <span className="book-category">{category}</span>)
          )}</div>
        )}

        {book.lang.length && (
          <div className="book-languages">{(
            book.lang.map(lang => <span className="book-language">{lang}</span>)
          )}</div>
        )}

        {book.description && <p>{book.description}</p>}

        {book.unitsInStock
          ? <><p className="pass-item">In stock:</p> <span>{book.unitsInStock}</span></>
          : <p className="err-item">Sold Out!</p>
        }

        <input
          type="number" id="quantity" {...register('quantity', {
            required: true, min: 0, max: book.unitsInStock, value: 1
          })}
        />

        {errors.quantity && <p className="err-msg">{errors.quantity.message}</p>}

        <div className="book-actions">
          <button title="Add to Wishlist" onClick={onAddToWishlist}>Add to Wishlist ❤️</button>
          <button title="Add to Cart" onClick={onAddToCart}>Add to Cart 🛒</button>
          <button title="Buy" type="submit">Buy Now</button>
        </div>
      </div>
    </form>
  )
}
