import { Request, Response } from 'express'
import { Book } from '../models/Book.ts'
import { logEvents } from '../middlewares/logger.ts'

import { HttpError } from '../utils/exceptions.ts'


export async function addBook(req: Request, res: Response) {
  req.body.seller = req.body.seller ?? req.__userAuth.id

  const newBook = new Book(req.body)
  await newBook.save().catch(err => {
    throw new HttpError('Error while adding book', { cause: err })
  })
  res.status(201).json(newBook)
  await logEvents(`Seller ${req.body.seller} added a book ${newBook._id}`)
}


export async function getBooks(req: Request, res: Response) {
  const { query, limit = '8', fields = '' } = req.query
  const queryObj = query ? { title: { $regex: query, $options: 'i' } } : {}
  
  const limitInt = parseInt(limit as string)

  let fieldsStr = fields as string
  let fieldsArr = fieldsStr.includes(',') ? fieldsStr.trim().split(',') : []

  let projectionObj: Record<string, 1 | -1> | null = (fieldsArr.length > 0)
    ? Object.fromEntries(fieldsArr.map(elem => [elem, 1]))
    : {}

  console.log('projection obj: ', JSON.stringify(projectionObj))

  const resBooks = await Book.aggregate([
    {
      $lookup: {
        from: 'users',
        localField: 'seller',
        foreignField: '_id',
        as: 'resBooks',
      },
    },
    // { $unwind: '$resBooks' },
    { $match: queryObj },
    { $limit: limitInt },
    {
      $project: {
        _id: 0,
        resBooks: {
          name: 1
        },
        // $getField: {
        //   field: "name",
        //   input: '$resBooks'
        // },
        ...projectionObj
      }
    }
  ]).catch(err => {
    throw new HttpError('Error while fetching books', { cause: err })
  })

  res.status(200).json(resBooks)
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
