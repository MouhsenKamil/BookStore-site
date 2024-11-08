import { Request, Response } from 'express'
import { Book, IBook } from '../models/Book.ts'
import { logEvents } from '../middlewares/logger.ts'

import { HttpError } from '../utils/exceptions.ts'


export async function addBook(req: Request, res: Response) {
  req.body.seller = req.body.seller ?? req.__userAuth.id

  const newBook = new Book(req.body)
  await newBook.save().catch(err => {
    throw new HttpError('Error while adding book', { cause: err })
  })
  res.status(201).json(newBook)
  logEvents(`Seller ${req.body.seller} added a book ${newBook._id}`)
}


export async function getBooks(req: Request, res: Response) {
  const { query, limit = '8', fields = [] } = req.query

  // Regex to implement fuzzy search
  const searchRegex = new RegExp((query as string).replace('/', '\\/').split('').join(".*"), 'i')
  const queryObj = query ? { title: { $regex: searchRegex } } : {}

  const limitInt = parseInt(limit as string)

  let projectionObj = (fields instanceof Array && fields.length > 0)
    ? Object.fromEntries(fields.map(elem => [elem, 1])) : {}

  try {
    let resBooks

    if (projectionObj.seller !== undefined)
      resBooks = await Book.aggregate([
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
        { $match: queryObj },
        { $limit: limitInt },
        {
          $project: {
            _id: 0,
            ...projectionObj,
            sellerName: "$resBooks.name",
          }
        },
      ])

    else
      resBooks = await Book.find(
        queryObj, { _id: 0, ...projectionObj }, { limit: limitInt }
      )

    res.status(200).json(resBooks)

  } catch (err) {
    throw new HttpError('Error while fetching books', { cause: err as Error })
  }
}


export async function getBookById(req: Request, res: Response) {
  const { bookId } = req.params

  const book = await Book.findById(bookId)
    .catch(err => {
      throw new HttpError(`Error while fetching book`, { cause: err })
    })

  if (!book)
    throw new HttpError('Book not found', { statusCode: 404 })

  res.status(200).json(book)
}


export async function updateBook(req: Request, res: Response) {
  const { bookId } = req.params

  const updatedBook = await Book.findByIdAndUpdate(
    bookId, req.body, { runValidators: true, new: true }
  )
  .catch(err => {
    throw new HttpError(`Error while updating book`, { cause: err })
  })

  if (!updatedBook)
    throw new HttpError('Book not found', { statusCode: 404 })

  res.sendStatus(204)
}


export async function deleteBook(req: Request, res: Response) {
  const { bookId } = req.params
  const deletedBook = await Book.findByIdAndDelete(bookId)
    .catch(err => {
      throw new HttpError(`Error while deleting book`, { cause: err })
    })

  if (!deletedBook)
    throw new HttpError('Book not found', { statusCode: 404 })

  res.sendStatus(204)
}
