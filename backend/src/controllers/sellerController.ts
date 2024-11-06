import { Request, Response } from 'express'

import { HttpError } from '../utils/exceptions.ts'
import { addBook } from './bookController.ts'

import { Book } from '../models/Book.ts'
import { BookArchive } from '../models/BooksArchive.ts'


export async function registerBook(req: Request, res: Response) {
  await addBook(req, res)
    .catch(err => {
      throw new HttpError('Error while registering book', { cause: err })
    })
}


export async function getSalesAnalytics(req: Request, res: Response) {
  const booksInStock = await Book.countDocuments({ seller: req.__userAuth.id })
  const booksSold = await BookArchive.countDocuments({ seller: req.__userAuth.id })

  res.status(200).json({ booksInStock, booksSold })
}
