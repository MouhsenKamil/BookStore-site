import { useForm } from "react-hook-form"
// import axios from "axios"
// import { useNavigate } from "react-router-dom"
import { useState } from "react"

// import { useAuth } from "../../../hooks/useAuth"


interface IBookFormInputs {
  authorName: string[]
  title: string
  subtitle: string | null
  lang: string[]
  categories: string[]
  coverImage: File | null
  description: string | null
  price: number
  unitsInStock: number
}


export default function AddBook() {
  const { register, handleSubmit, formState: { errors } } = useForm<IBookFormInputs>()
  const [addBookErr, setAddBookErr] = useState('')
  // const navigate = useNavigate()
  const [coverImage, setCoverImage] = useState<FileList | null>(null)

  const onSubmit = async (data: IBookFormInputs) => {
    try {
      console.log(data)
      alert('Book has been added successfully!')
      // navigate('/')
      // console.log(JSON.stringify(data))
      // console.log(coverImage)
      // console.log(coverImage)
      // data.coverImage = coverImage
      // const formData = new FormData()

      // Object.entries(data).forEach(([key, value]) => {
      //   if (key === "coverImage" || value === undefined || value === null)
      //     return

      //   if (value instanceof Array) {
      //     for (let val of value)
      //       formData.append(key + '[]', val)
      //     return
      //   }

      //   formData.append(key, value)
      // })

      // if (coverImage)
      //   formData.append("coverImage", coverImage[0], coverImage[0].name)

      // if (coverImage)
      //   data.coverImage = coverImage[0]

      // const response = await axios.put(
      //   '/api/seller/@me/add-book', data, { withCredentials: true }
      // )

      // if (response.status !== 201)
      //   throw new Error(response.data.error)

    } catch (err) {
      console.error(err)
      setAddBookErr((err as Error).message)
    }
  }

  return (
    <form className="add-book-form" onSubmit={handleSubmit(onSubmit)} encType="multipart/form-data">
      <div className="form-heading">Register a book</div>
      <input
        type="text"
        {...register("title", { required: "Title is required" })}
        placeholder="Book title"
      />
      {errors.title && <p className="error-msg">{errors.title.message}</p>}

      <input type="text" {...register("subtitle")} placeholder="Book subtitle"/>

      <input
        type="text"
        {...register("authorName", {
          required: "Author name is required",
          setValueAs: (v) => v.split(",").map((item: string) => item.trim()),
        })}
        placeholder="Author Name(s) (comma-separated)"
      />
      {errors.authorName && <p className="error-msg">{errors.authorName.message}</p>}

      <input
        type="text"
        {...register("lang", {
          required: "At least one language is required",
          setValueAs: (v) => v.split(",").map((item: string) => item.trim()),
        })}
        placeholder="Language (comma-separated)"
      />
      {errors.lang && <p className="error-msg">{errors.lang.message}</p>}

      <input
        type="text"
        {...register("categories", {
          required: "At least one category is required",
          setValueAs: (v: string) => v.split(",").map((item: string) => item.trim()),
        })}
        placeholder="Categories (comma-separated)"
      />
      {errors.categories && <p className="error-msg">{errors.categories.message}</p>}

      <label htmlFor="coverImage">Cover Image: </label>
      <input type="file" {...register("coverImage")} onChange={(e) => {
          if (e.target.files?.length)
            setCoverImage(e.target.files)
        }}
      />
      {errors.coverImage && <p className="error-msg">{errors.coverImage.message}</p>}

      <textarea {...register("description")} placeholder="Enter the description..."/>

      <label htmlFor="price">Price (in INR)</label>
      <input
        type="number"
        step="0.01"
        {...register("price", {
          required: "Price is required",
          min: { value: 20.0, message: "Price must be greater than 20" },
        })}
      />
      {errors.price && <p className="error-msg">{errors.price.message}</p>}

      <label>Units Stocked: </label>
      <input
        type="number"
        {...register("unitsInStock", {
          required: "Units in stock is required",
          min: { value: 0, message: "Units in stock cannot be negative" },
        })}
      />
      {errors.unitsInStock && <p className="error-msg">{errors.unitsInStock.message}</p>}

      {addBookErr && <>
        <hr />
        <p className="error-msg">{addBookErr}</p>
      </>}
      <button type="submit">Add Book</button>
    </form>
  )
}
