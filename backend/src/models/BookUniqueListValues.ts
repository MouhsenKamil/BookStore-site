import mongoose, { Schema, Document } from "mongoose"


export interface IBookUniqueListValues {
  categories: string[]
  authorNames: string[]
  lang: string[]
}

type BookUniqueListValuesDoc = IBookUniqueListValues & Document

export const BookUniqueListValues = mongoose.model<BookUniqueListValuesDoc>(
  "book_unique_list_values", new Schema({
    categories: { type: [String], required: true },
    authorNames: { type: [String], required: true },
    lang: { type: [String], required: true }
  }),
  "book_unique_list_values"
)
