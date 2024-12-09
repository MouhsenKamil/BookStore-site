import{ useEffect, useState } from "react"
import { useForm, Controller } from "react-hook-form"
import axios from "axios"
import Slider from "rc-slider"

import { IBook } from "../../../types/book"

import "rc-slider/assets/index.css"
import './AdvancedSearch.css'
import { useLocation } from "react-router-dom"


interface SearchParamsData {
  query: string
  subtitle?: string
  lang?: string[]
  authorNames?: string[]
  categories?: string[]
  minPrice?: number,
  maxPrice?: number,
  sellerName?: string
}

interface SearchFormData {
  query: string
  subtitle?: string
  lang?: string[]
  authorNames?: string[]
  categories?: string[]
  priceRange: [number, number]
  sellerName?: string
}


export default function AdvancedBookSearch() {
  const location = useLocation()
  const searchParams = Object.fromEntries(new URLSearchParams(decodeURI(location.search)))

  const [books, setBooks] = useState<IBook[]>([])
  const { handleSubmit, control, register } = useForm<SearchFormData>({
    defaultValues: {
      query: "",
      subtitle: "",
      lang: [],
      categories: [],
      authorNames: [],
      priceRange: [0, 5000],
      sellerName: ''
    }
  })

  useEffect(() => {
    console.log(searchParams)

    if (!searchParams.query)
      return

    // const priceRange = (params.get("priceRange") as unknown) as [number, number]

    onSubmit({
      query: searchParams.query || '',
      subtitle: searchParams.subtitle || '',
      lang: (searchParams.lang as string[]) ?? [],
      categories: searchParams.categories.spliit() ?? [],
      minPrice: +(searchParams.minPrice ?? 0),
      maxPrice: +(searchParams.maxPrice ?? 5000),
      sellerName: searchParams.sellerName ?? undefined,
    })
  }, [])

  const onSubmit = async (data: SearchParamsData) => {
    try {
      const response = await axios.get("/api/books/", {
        params: Object.entries(data).filter(([_, val]) => val === null || val === undefined)
      })

      if (response.status !== 200)
        throw new Error(
          response.data.message || response.data.error || 'Unable to fetch results'
        )

      setBooks(response.data.results)
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <div className="advanced-search">
      <form onSubmit={handleSubmit(onSubmit)} className="filters">
        <input type="text" placeholder="Subtitle" {...register("subtitle")} />
        <input type="text" placeholder="Language" {...register("lang")} />
        <input type="text" placeholder="Categories" {...register("categories")} />
        <input type="text" placeholder="Seller Name" {...register("sellerName")} />
        <div className="price-filter">
          <Controller
            name="priceRange"
            control={control}
            render={({ field }) => (
              <>
                <p>Price Range: ₹{field.value[0] || 0} - ₹{field.value[1] || 1000}</p>
                <Slider
                  range min={0} max={5000} defaultValue={[0, 1000]} onChange={field.onChange}
                />
              </>
            )}
          />
        </div>
        <button type="submit">Search</button>
      </form>
      <div className="book-list">
        {!books.length ? (
          <p>No books found matching your criteria.</p>
        ) : (
          <ul>
            {books.map((book) => (
              <li key={book._id} className="book-item">
                <img src={book.coverImage || "placeholder.jpg"} alt={book.title} />
                <h3>{book.title}</h3>
                <p>{book.subtitle}</p>
                <p>Languages: {book.lang.join(", ")}</p>
                <p>Categories: {book.categories.join(", ")}</p>
                <p>Price: ₹{book.price}</p>
                <p>Seller: {book.seller}</p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}
