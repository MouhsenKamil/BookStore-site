import{ useEffect, useState } from "react"
import { useForm, Controller } from "react-hook-form"
import { useParams } from "react-router-dom"
import axios from "axios"
import Slider from "rc-slider"

import { IBook } from "../../../types/book"

import "rc-slider/assets/index.css"
import './AdvancedSearch.css'


interface SearchFormData {
  query: string
  subtitle?: string
  lang?: string
  categories?: string
  priceRange: [number, number]
  sellerName?: string
}


export default function AdvancedBookSearch() {
  const params = useParams()
  const [books, setBooks] = useState<IBook[]>([])
  const { handleSubmit, control, register } = useForm<SearchFormData>({
    defaultValues: {
      query: "",
      subtitle: "",
      lang: "",
      categories: "",
      priceRange: [0, undefined],
      sellerName: "",
    },
  })

  useEffect(() => {
    if (!params.query)
      return

    console.log(params)
    const priceRange = (params.priceRange as unknown) as [number, number]

    onSubmit({
      query: params.query,
      subtitle: params.subtitle,
      lang: params.lang,
      categories: params.categories,
      priceRange: priceRange,
      sellerName: params.sellerName,
    })
  }, [])

  const onSubmit = async (data: SearchFormData) => {
    try {
      const response = await axios.get("/api/books/", {
        params: {
          query: data.query,
          subtitle: data.subtitle,
          lang: data.lang,
          categories: data.categories,
          minPrice: data.priceRange[0],
          maxPrice: data.priceRange[1],
          sellerName: data.sellerName,
        },
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
