import { Request, Response } from 'express'
import { Book, BookDoc } from '../models/Book.ts'


export async function addBook(req: Request, res: Response) {
  req.body.seller = req.body.seller ?? req.__userAuth.id

  try {
    const newBook = new Book(req.body)
    await newBook.save()
    res.status(201).json(newBook)
  } catch (error) {
    res.status(500).json({ message: 'Error adding book' })
  }
}


export async function getBooks(req: Request, res: Response) {
  try {
    const { query } = req.query
    const query_obj = query ? { title: { $regex: query, $options: 'i' } } : {}
    const books = await Book.find(query_obj)

    if (!books) {
      res.status(404).json({ message: `No books found for '${query}'` })
      return
    }
    res.status(201).json(books)

  } catch (error) {
    res.status(500).json({ message: 'Server Error' })
    res.status(500).json({ message: 'Server Error' })
  }
}


export async function getBookById(req: Request, res: Response) {
  const { bookid } = req.params

  try {
    const book = await Book.findById(bookid)

    if (!book) {
      res.status(404).json({ message: 'Book not found' })
      return
    }
    res.status(200).json(book)

  } catch (error) {
    res.status(500).json({ message: `Error fetching book ${bookid}` })
  }
}


export async function updateBook(req: Request, res: Response) {
  const { bookid } = req.params

  try {
    const updatedBook = await Book.findByIdAndUpdate(
      bookid, req.body, { runValidators: true, new: true }
    )

    if (!updatedBook) {
      res.status(404).json({ message: 'Book not found' })
      return
    }

    res.sendStatus(204)
  } catch (error) {
    res.status(500).json({ message: `Error updating book ${bookid}` })
  }
}


export async function deleteBook(req: Request, res: Response) {
  const { bookid } = req.params

  try {
    const deletedBook = await Book.findByIdAndDelete(bookid)
    if (!deletedBook) {
      res.status(404).json({ message: 'Book not found' })
      return
    }

    res.sendStatus(204)
  } catch (error) {
    res.status(500).json({ message: `Error deleting book ${bookid}` })
  }
}
