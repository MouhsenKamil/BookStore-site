import mongoose, { Document, Schema } from 'mongoose'


export interface ILanguage {
  code: string
  english: string[]
  native: string[]
}

type LanguageDoc = ILanguage & Document

export const Language = mongoose.model<LanguageDoc>('languages', new Schema({
  code: { type: String, required: true, unique: true },
  english: { type: [String], required: true },
  native: { type: [String], required: true }
}))
