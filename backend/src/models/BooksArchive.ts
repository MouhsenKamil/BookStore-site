import mongoose from 'mongoose'
import { BookDoc, BookSchema } from './Book'


export const BookArchive = mongoose.model<BookDoc>('books_archive', BookSchema)
