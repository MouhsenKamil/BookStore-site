import mongoose, { Document, Schema } from "mongoose"

export interface ICategory {
  name: string
}

type CategoryDoc = ICategory | Document

export const Category = mongoose.model<CategoryDoc>("categories", new Schema({
  name: { type: String, required: true, unique: true, index: true },
}))
