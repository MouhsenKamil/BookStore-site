import { Link, useNavigate, useParams } from "react-router-dom"
import { useState, MouseEvent, useEffect } from "react"
import axios from "axios"

import languages from "../../../public/languages-iso-639-2.json"
import { IBook, IBookWithSellerName } from "../../../types/book"
import CoverImage from "../CoverImage/CoverImage"
import { AddtoCartButton, AddtoWishlistButton } from "../CommonButtons"
import IntInput from "../IntInput/IntInput"
import { useAuth } from "../../../hooks/useAuth"
import { toTitleCase } from "../../../utils/stringUtils"
import { updateBookAPI } from "../../../services/bookServices"

import './Book.css'


type bookStateType = IBookWithSellerName & { error?: string }

interface TagsProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string
  items: string[]
  // editable: boolean
}

type getElementsAndTheirAttrsInStructRetVal = {
  [key in keyof Omit<IBook, '_id' | 'coverImage' | 'quantity' | 'seller'>]: {
    elem: HTMLDivElement | null, value: string | string[] | number | null
  }
}

export default function Book() {
  const { bookId } = useParams()
  const navigate = useNavigate()

  if (!bookId || bookId === "undefined") {
    alert("Parameter 'bookId' has no value.")
    navigate('/')
    return
  }

  const { user } = useAuth().authState

  const [book, setBook] = useState<bookStateType>({} as IBookWithSellerName)
  const [quantity, setQuantity] = useState(1)

  const [editing, setEditing] = useState(false)

  function getElementsAndTheirAttrsInStruct(): getElementsAndTheirAttrsInStructRetVal {
    const parentElem = document.querySelector(".book-info") as HTMLDivElement

    return {
      title: { elem: parentElem.querySelector(".book-title"), value: book.title },
      subtitle: { elem: parentElem.querySelector(".book-subtitle"), value: book.subtitle },
      authorNames: { elem: parentElem.querySelector(".authors-publishers"), value: book.authorNames },
      categories: { elem: parentElem.querySelector(".categories"), value: book.categories },
      lang: { elem: parentElem.querySelector(".languages"), value: book.lang },
      description: { elem: parentElem.querySelector(".book-desc div"), value: book.description },
      price: { elem: parentElem.querySelector('.book-price'), value: book.price },
      unitsInStock: { elem: parentElem.querySelector('.stock-count-val'), value: book.unitsInStock },
    }
  }

  function TagsList(props: TagsProps) {
    const { title, items, className = '', ...otherProps } = props
    const [itemsList, setItemsList] = useState<string[]>(items)

    if (!items || !items.length)
      return <></>

    return (
      <div className={"tags-list " + className} {...otherProps}>
        <span className="tags-title">{title} </span>{(
          itemsList.map((item, key) => 
            <span key={key} className="tags-item">
              <span className="tag-item-content" contentEditable={editing}>
                {toTitleCase(item)}
              </span>
              {editing && <span
                className="item-btn del-item-btn" title="Remove item" onClick={() => {
                setItemsList(itemsList.filter(_item => _item !== item))
              }}>
                &nbsp;x
              </span>}
            </span>
        ))}
        {editing && <span
          className="item-btn add-item-btn" title="Add Item"
          onClick={e => {
            const parentElem = e.currentTarget.parentElement
            if (!parentElem) return

            const itemsElements = (
              parentElem.querySelectorAll('.tag-item-content') as unknown
            ) as NodeList

            const itemsElementsText: string[] = Array.from(itemsElements).map(
              (value) => value.textContent || ''
            )

            if (itemsElementsText.filter(item => item.trim() === '').length === 0)
              setItemsList([...itemsList, ''])
          }}
        >
          +
        </span>}
      </div>
    )
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

  const onDelete = async (_: MouseEvent<HTMLButtonElement>) => {
    const response = await axios.delete(`/api/books/${bookId}`, { withCredentials: true })
    if (response.status >= 400) {
      alert(response.data.error)
      return
    }

    alert('Book has been deleted successfully')
    navigate("/")
  }

  async function onEdit() {
    if (!editing) {
      setEditing(true)
      return
    }

    const htmlElements = getElementsAndTheirAttrsInStruct()

    let changedValues: Partial<Omit<IBook, '_id'>> = {}

    changedValues.authorNames = Array.from(
      htmlElements.authorNames.elem?.querySelectorAll('.tag-item-content') || []
    ).map((value) => value.textContent as string)

    changedValues.categories = Array.from(
      htmlElements.categories.elem?.querySelectorAll('.tag-item-content') || []
    ).map((value) => value.textContent as string)

    changedValues.lang = Array.from(
      htmlElements.lang.elem?.querySelectorAll('.tag-item-content') || []
    ).map((value) => value.textContent as string)

    changedValues = {
      title: htmlElements.title.elem?.textContent ?? htmlElements.title.value,
      subtitle: htmlElements.subtitle.elem?.textContent ?? htmlElements.subtitle.value,
      description: htmlElements.description.elem?.textContent ?? htmlElements.description.value,
      price: +(htmlElements.price.elem?.textContent ?? htmlElements.price.value ?? 0),
      unitsInStock: +(htmlElements.unitsInStock.elem?.textContent ?? htmlElements.unitsInStock.value ?? 0),
      ...changedValues
    } as Partial<Omit<IBook, '_id'>>

    await updateBookAPI(bookId as string, changedValues as IBook)

    setBook({ ...book, ...changedValues })
    setEditing(false)
  }

  return (
    <div className="book-display">
      <CoverImage coverImg={book.coverImage} alt={book.title} />

      <div className="book-info">
        <h1 className="book-title" contentEditable={editing}>{book.title}</h1>
        {book.subtitle && <h5 className="book-subtitle" contentEditable={editing}>{book.subtitle}</h5>}

        <TagsList
          className="authors-publishers" title="Authors and Publishers" items={book.authorNames}
        />
        <TagsList className="categories" title='Categories' items={book.categories} />

        <TagsList className="languages" title="Languages" items={
          (book.lang || []).map(langCode => {
            const langObj = languages.find(elem => elem.code === langCode)
            return langObj?.english.at(0) ?? langCode
          })}
        />

        <div className="book-desc">
          <h4>Description</h4>
          <div contentEditable={editing}>{
            (book.description || "No Description")
              .trim().split(/(?:\r?\n\s*)+/).map(
                (paragraph, key) => <p key={key}>{paragraph}</p>
              )
          }</div>
        </div>

        <p><b>Seller: </b>{book.sellerName}</p>

        ₹ <h2 className="book-price" style={{ display: "inline", color: 'orange' }} contentEditable={editing}>
          {book.price?.toFixed(2) ?? '---'}
        </h2>

        <p className="stock-count">
          {book.unitsInStock
            ? <>
              <span className="pass-item">In Stock: </span>
              <span className="stock-count-val" contentEditable={editing}>{book.unitsInStock}</span>
            </>
            : <span style={{color: "red"}}>Sold Out!</span>
          }
        </p>

        {(user?.type === 'customer') && !editing && <>
            <label className="quantity-input">
              Quantity: 
              <input
                type="number" id="quantity" name='quantity' required min={0}
                max={book.unitsInStock} value={1}
              />
            </label>

            <div className="book-actions">
              <IntInput text="Quantity: " min={1} max={book.unitsInStock}
                onValChange={val => { setQuantity(val) }}
              />
              <AddtoWishlistButton bookId={bookId} />
              <AddtoCartButton bookId={bookId} />

              <button title="Buy" onClick={() => {
                navigate(`/user/checkout?method=bookOnly&bookId=${bookId}&quantity=${quantity}`)
              }}>Buy Now</button>
            </div>
          </>
        }

        {(user?.type === 'admin') && <div className="book-actions">
            <button title="Edit" onClick={async () => await onEdit()}>
              {!editing ? "Edit": "Confirm"}
            </button>
            {editing && <button title="Cancel" onClick={() => {
                setEditing(false)
                const elementsAndValues = getElementsAndTheirAttrsInStruct()

                Object.entries(elementsAndValues).map(([_, { elem, value }]) => {
                  if (!value || !elem)
                    return

                  elem.textContent = (typeof value === "string") ? value : value?.toString()
                })
              }}>Cancel
              </button>
            }
            <button title="Delete" onClick={onDelete}>Delete</button>
          </div>
        }
      </div>
    </div>
  )
}
