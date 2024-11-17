import mongoose, { Schema, Document, Types } from 'mongoose'
import { Category } from './Category'
import { Author } from './Author'


export interface IBook {
  _id: string
  authorNames: Array<string>
  title: string
  subtitle: string | null
  lang: Array<string>
  categories: Array<string>
  coverImage: string | null
  description: string | null
  price: number
  unitsInStock: number
  seller: Types.ObjectId
}

export interface IBookWithSellerName extends IBook {
  sellerName: string
}

export type BookDoc = IBook & Document

export const BookSchema = new Schema<BookDoc>({
  authorNames: { type: [String], required: true },
  title: { type: String, required: true },
  subtitle: String,
  lang: { type: [String], required: true, default: ['eng'], validate: {
    validator: (val: string) => val.length > 0,
    message: 'Language code must not be empty'
  }},
  categories: { type: [String], required: true },
  coverImage: String,
  description: String,
  price: { type: Number, required: true, min: 1 },
  unitsInStock: { type: Number, required: true, min: 0, default: 1 },
  seller: { type: Schema.Types.ObjectId, required: true, ref: 'User' },
}, {
  timestamps: { createdAt: true, updatedAt: false }
})


async function updateCategories(categories: string[]) {
  for (const category of categories)
    await Category.updateOne(
      { name: category.trim() }, { $setOnInsert: { name: category } }, { upsert: true }
    )
}


async function updateAuthorNames(authorNames: string[]) {
  for (const authorName of authorNames)
    await Author.updateOne(
      { name: authorName.trim() }, { $setOnInsert: { name: authorName } }, { upsert: true }
    )
}


BookSchema.post<BookDoc>('save', async function () {
  await Promise.all([updateCategories(this.categories), updateAuthorNames(this.authorNames)])
})


BookSchema.post<BookDoc>(
  ['updateOne', 'updateMany', 'findOneAndUpdate'],
  async function () {
    const changes = this.getChanges()
    let promises = []

    if (changes && changes.categories)
      promises.push(updateCategories(changes.categories))

    if (changes && changes.authorNames)
      promises.push(updateAuthorNames(changes.authorNames))

    if (promises.length)
      await Promise.all(promises)
  }
)


export const Book = mongoose.model<BookDoc>('books', BookSchema)
