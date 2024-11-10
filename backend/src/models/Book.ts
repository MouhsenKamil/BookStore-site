import mongoose, { Schema, Document, Types } from 'mongoose'


export interface IBook {
  authorName: Array<string>
  title: string
  subtitle: string | null
  lang: Array<string>
  subject: Array<string>
  coverImage: string | null
  description: string | null
  price: number
  unitsInStock: number
  seller: Types.ObjectId
  createdAt: Date
}

export interface IBookWithSellerName extends IBook {
  sellerName: string
}

export type BookDoc = IBook & Document

export const BookSchema = new Schema<BookDoc>({
  authorName: { type: [String], required: true },
  title: { type: String, required: true },
  subtitle: String,
  lang: { type: [String], required: true, default: ['eng'], validate: {
    validator: (val: string) => val.length > 0,
    message: 'Language code must not be empty'
  }},
  subject: { type: [String], required: true },
  coverImage: String,
  description: String,
  price: { type: Number, required: true, min: 1 },
  unitsInStock: { type: Number, required: true, min: 0, default: 1 },
  seller: { type: Schema.Types.ObjectId, required: true, ref: 'User' },
}, {
  timestamps: { createdAt: true, updatedAt: false }
})

export const Book = mongoose.model<BookDoc>('books', BookSchema)
