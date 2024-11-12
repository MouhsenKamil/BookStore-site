import { Request, Response } from 'express'
import { Book, IBook, IBookWithSellerName } from '../models/Book.ts'
import { logEvents } from '../middlewares/logger.ts'

import { HttpError } from '../utils/exceptions.ts'
import { Seller } from '../models/Seller.ts'


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


export async function getBooks(req: Request, res: Response) {
  const {
    query, limit = '1', fields = [], sort = 'title', order = 'asc', ...otherQueries
  } = req.query

  // Regex to implement fuzzy search
  // const searchRegex = new RegExp((query as string).replace('/', '\\/').split('').join(".*"), 'i')
  const searchRegex = new RegExp((query as string).replace('/', '\\/'), 'i')
  const queryObj = query ? { title: { $regex: searchRegex }, ...otherQueries } : otherQueries
  const limitInt = +limit

  const orderStr = (order as string).toLowerCase()

  if (!['asc', 'desc'].includes(orderStr))
    throw new HttpError(`Invalid value for sort order: ${order}`, { statusCode: 400 })

  const orderInt = (orderStr === 'asc') ? 1: -1

  let projectionObj = (fields instanceof Array && fields.length > 0)
    ? Object.fromEntries(fields.map(elem => [elem, 1])) : {}

    // projectionObj.id = projectionObj.id ?? 0

  try {
    let resBooks: IBook[]

    if (projectionObj.seller !== undefined)
      resBooks = await Book.aggregate([
        { $match: queryObj },
        { $limit: limitInt },
        {
          $lookup: {
            from: "users",
            localField: "seller",
            foreignField: "_id",
            as: "resBooks",
          },
        },
        // { $unwind: { path: "$resBooks", preserveNullAndEmptyArrays: true } },
        { $unwind: "$resBooks" },
        { $sort: { [sort as string]: orderInt }},
        {
          $project: {
            ...projectionObj,
            sellerName: "$resBooks.name",
            id: '_id'
          }
        },
      ])

    else
      resBooks = await Book.find(
        queryObj, projectionObj, { limit: limitInt }
      )

    res.status(200).json({ total: resBooks.length, results: resBooks })

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
