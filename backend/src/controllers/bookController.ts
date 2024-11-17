import { Request, Response } from 'express'
import { PipelineStage } from 'mongoose'

import { Book, IBookWithSellerName } from '../models/Book.ts'
import { logEvents } from '../middlewares/logger.ts'
import { HttpError } from '../utils/exceptions.ts'
import { Seller } from '../models/Seller.ts'
import { BookArchive } from '../models/BooksArchive.ts'
import { getRandInt } from '../utils/funcUtils.ts'
import { ICheckoutFormData, Order } from '../models/Order.ts'
// import { BookUniqueListValues } from '../models/BookUniqueListValues.ts'
import { metadataListQuerier } from '../utils/bookUtils.ts'
import { Language } from '../models/Languages.ts'
import { Author } from '../models/Author.ts'
import { Category } from '../models/Category.ts'


interface IBookPurchaseFormData extends ICheckoutFormData {
  quantity: number
}

interface SearchFilters {
  // title: string // query is the title
  subtitle?: string
  lang?: string[]
  categories?: string[]
  authorName?: string[]
  minPrice?: number
  maxPrice?: number
  sellerName?: string
  query?: string
  limit?: number
  fields?: Array<keyof IBookWithSellerName>
  sort?: keyof IBookWithSellerName
  stocksAvailable?: boolean
  order?: 'asc' | 'desc'
}


export async function addBook(req: Request, res: Response) {
  req.body.seller = req.body.seller ?? req.__userAuth.id

  console.log(JSON.stringify(req.body))
  return

  const newBook = new Book(req.body)
  await newBook.save().catch(err => {
    throw new HttpError('Error occurred while adding book', { cause: err })
  })
  res.status(201).json({ message: 'Book created', bookId: newBook._id })
  logEvents(`Seller ${req.body.seller} added a book ${newBook._id}`)
}


// try {
//   const pipeline: any[] = []

//   if (title) {
//     pipeline.push({
//       $match: {
//         title: { $regex: title, $options: "i" },
//       },
//     })
//   }

//   if (subtitle) {
//     pipeline.push({
//       $match: {
//         subtitle: { $regex: subtitle, $options: "i" },
//       },
//     })
//   }


//   if (lang) {
//     pipeline.push({
//       $match: {
//         lang: { $in: lang.split(",") },
//       },
//     })
//   }


//   if (categories) {
//     pipeline.push({
//       $match: {
//         categories: { $in: categories.split(",") },
//       },
//     })
//   }


//   if (minPrice || maxPrice) {
//     pipeline.push({
//       $match: {
//         price: {
//           $gte: minPrice || 0,
//           $lte: maxPrice || Infinity,
//         },
//       },
//     })
//   }


//   if (sellerName) {
//     pipeline.push(
//       {
//         $lookup: {
//           from: "sellers",
//           localField: "seller",
//           foreignField: "_id",
//           as: "sellerDetails",
//         },
//       },
//       {
//         $unwind: "$sellerDetails",
//       }
//     )


//     pipeline.push({
//       $match: {
//         "sellerDetails.name": { $regex: sellerName, $options: "i" },
//       },
//     })
//   }


//   pipeline.push({
//     $project: {
//       title: 1,
//       subtitle: 1,
//       lang: 1,
//       categories: 1,
//       price: 1,
//       unitsInStock: 1,
//       sellerName: "$sellerDetails.name",
//       coverImage: 1,
//       description: 1,
//     },
//   })

//   const books = await Book.aggregate(pipeline)


export async function getBooks(req: Request, res: Response) {
  const {
    query = '', limit = 1, fields = [], sort = 'title', order = 'asc',
    subtitle, lang, categories, minPrice, maxPrice, sellerName
  }: SearchFilters = req.query

  // Regex to implement fuzzy search
  // const searchRegex = new RegExp((query as string).replace('/', '\\/').split('').join(".*"), 'i')

  if (!['asc', 'desc'].includes(order))
    throw new HttpError(`Invalid value for sort order: ${order}`, { statusCode: 400 })

  const sellerNameInFields = fields.includes('sellerName')

  let projectionObj: { [key: string]: number | string } =
    (fields.length) ? Object.fromEntries(fields.map(elem => [elem, 1])) : {}

  let filters: any = {}
  let pipeline: PipelineStage[] = []

  if (query)
    filters.title = { $regex: new RegExp(query.replace('/', '\\/'), 'i') }

  if (subtitle)
    filters.subtitle = { $regex: new RegExp(subtitle.replace('/', '\\/'), 'i') }

  if (lang && lang.length)
    filters.lang = { $in: lang }

  if (categories && categories.length)
    filters.categories = { $in: categories }

  if (minPrice || maxPrice)
    filters.price = { $gte: minPrice || 0, $lte: maxPrice || Infinity }

  if (sellerName || sellerNameInFields) {
    pipeline.push(
      {
        $lookup: {
          from: "sellers",
          localField: "seller",
          foreignField: "_id",
          as: "sellerDetails",
          pipeline: [
            {
              $project: {
                _id: 0, name: 1
              }
            }
          ]
        }
      },
      { $unwind: "$sellerDetails" },
      {
        $project: {
          sellerName: "$sellerDetails.name",
        }
      }
    )

    if (sellerName)
      filters.sellerName = { $regex: new RegExp(sellerName.replace('/', '\\/'), 'i') }

    if (sellerNameInFields)
      projectionObj.sellerName = "$sellerDetails.name"
  }


  pipeline.push(
    { $match: filters },
    { $sort: { [sort]: (order.toLowerCase() === 'asc') ? 1 : -1 } },
    { $limit: +(limit || 1) },
    { $project: projectionObj },
  )

  try {
    // let resBooks: IBook[]

    // if (projectionObj.seller !== undefined)
    //   resBooks = await Book.aggregate([
    //     { $match: queryObj },
    //     { $limit: limitInt },
    //     {
    //       $lookup: {
    //         from: "users",
    //         localField: "seller",
    //         foreignField: "_id",
    //         as: "resBooks",
    //       },
    //     },
    //     // { $unwind: { path: "$resBooks", preserveNullAndEmptyArrays: true } },
    //     { $unwind: "$resBooks" },
    //     { $sort: { [sort as string]: orderInt }},
    //     {
    //       $project: {
    //         ...projectionObj,
    //         sellerName: "$resBooks.name",
    //       }
    //     },
    //   ])

    // else
    //   resBooks = await Book.find(
    //     queryObj, projectionObj, { limit: limitInt }
    //   )

    let resultBooks = await Book.aggregate(pipeline)
    res.status(200).json({ total: resultBooks.length, results: resultBooks })

  } catch (err) {
    throw new HttpError('Error occurred while fetching books', { cause: err as Error })
  }
}


export async function getBookById(req: Request, res: Response) {
  const { bookId } = req.params

  const book = await Book.findById(bookId, { _id: 0 })
    .catch(err => {
      throw new HttpError(`Error occurred while fetching book`, { cause: err })
    })

  if (!book)
    throw new HttpError('Book not found', { statusCode: 404 })

  const seller = await Seller.findById(book.seller)
    .catch(err => {
      throw new HttpError(`Error occurred while fetching book`, { cause: err })
    })

  let resObj = (book.toObject() as unknown) as IBookWithSellerName
  resObj.sellerName = seller?.name || ''

  res.status(200).json(resObj)
}


export async function updateBook(req: Request, res: Response) {
  const { bookId } = req.params

  const updatedBook = await Book.findByIdAndUpdate(
    bookId, req.body, { runValidators: true, new: true }
  )
    .catch(err => {
      throw new HttpError(`Error occurred while updating book`, { cause: err })
    })

  if (!updatedBook)
    throw new HttpError('Book not found', { statusCode: 404 })

  res.sendStatus(204)
}


export async function deleteBook(req: Request, res: Response) {
  const { bookId } = req.params
  const deletedBook = await Book.findByIdAndDelete(bookId)
    .catch(err => {
      throw new HttpError(`Error occurred while deleting book`, { cause: err })
    })

  if (!deletedBook)
    throw new HttpError('Book not found', { statusCode: 404 })

  res.sendStatus(204)
}


export async function purchaseBook(req: Request, res: Response) {
  const { quantity, ...checkoutProps }: IBookPurchaseFormData = req.body
  const { bookId, userId } = req.params

  const currentDate = new Date()
  const deliveredByDate = new Date(
    currentDate.getTime() + getRandInt(1, 7) * (24 * 60 * 60) // Delivery time: 1-7 days (random)
  )

  const order = new Order({
    user: userId,
    books: [{
      id: bookId,
      quantity,
      // unitPrice: bookId,
    }],
    orderTime: currentDate,
    deliveredBy: deliveredByDate,
    ...checkoutProps
  })

  await order.save()
    .catch(err => {
      throw new HttpError('Error occurred while processing checkout', { cause: err })
    })

  const originalBookObj = await Book.findById(bookId)
  if (!originalBookObj)
    return

  // Pass the purchased books to archive
  const archiveCopy = new BookArchive(originalBookObj.toJSON())

  // Update the original book
  await originalBookObj.updateOne({ $inc: { units_in_stock: -quantity } })

  // Set the available quantity in it with the purchased quantity
  await archiveCopy.updateOne({ $inc: { units_in_stock: quantity } })

  res.status(201).json({
    message: 'Order has been created successfully.',
    orderId: order._id,
    deliveredBy: deliveredByDate
  })
}


// export async function addToCart(req: Request, res: Response) {
//   const { bookId } = req.params
//   const userId = req.__userAuth.id

//   const cart = await Cart.findOneAndUpdate(
//     { user: userId },
//     {  }
//   )
// }


export async function suggestAuthorNames(req: Request, res: Response) {
  const { query = '' } = req.query

  if (typeof query !== "string")
    throw new HttpError("Expected 'query' to be a type of string.")

  if (!query) {
    res.status(200).json({ total: 0, results: [] })
    return
  }

  // const authorNames = await metadataListQuerier({ param: 'authorNames', query })
  const authorNames = await Author.find(
    { english: { $regex: `^${query.replace('/', '\\/')}`, $options: "i" } }, { english: 1 }
  )

  res.status(200).json({ total: authorNames.length, result: authorNames })
}


export async function suggestCategories(req: Request, res: Response) {
  const { query = '' } = req.query

  if (typeof query !== "string")
    throw new HttpError("Expected 'query' to be a type of string.")

  if (!query) {
    res.status(200).json({ total: 0, results: [] })
    return
  }

  // const categories = await metadataListQuerier({ param: 'categories', query })
  const categories = await Category.find(
    { english: { $regex: `^${query.replace('/', '\\/')}`, $options: "i" } }, { english: 1 }
  )

  res.status(200).json({ total: categories.length, result: categories })
}


export async function suggestLanguages(req: Request, res: Response) {
  const { query = '' } = req.query

  if (typeof query !== "string")
    throw new HttpError("Expected 'query' to be a type of string.")

  if (!query) {
    res.status(200).json({ total: 0, results: [] })
    return
  }

  // const langs = await metadataListQuerier({ param: 'lang', query })
  const langs = await Language.find(
    { english: { $regex: `^${query.replace('/', '\\/')}`, $options: "i" } }, { english: 1 }
  )

  res.status(200).json({ total: langs.length, result: langs })
}
