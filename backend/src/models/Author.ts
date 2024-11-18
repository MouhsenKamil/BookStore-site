import mongoose, { Document, Schema } from "mongoose"

export interface IAuthor {
  name: string
}

type AuthorDoc = IAuthor | Document

export const Author = mongoose.model<AuthorDoc>("authors", new Schema({
  name: { type: String, required: true, unique: true, index: true },
}))
