import { min } from "date-fns"
import mongoose, { Schema, Types, Document } from "mongoose";

export interface ICart {
  user: Types.ObjectId
  books: {
    id: Types.ObjectId
    quantity: number
    // unitPrice: number
  }[]
}

export type CartDoc = ICart & Document

export const Cart = mongoose.model<CartDoc>(
  'carts',
  new Schema<CartDoc>({
    user: {
      type: Schema.Types.ObjectId, ref: 'Customer',
      required: true, unique: true, index: true
    },
    books: [{
      id: { type: Schema.Types.ObjectId, ref: 'Book', required: true, unique: true },
      quantity: { type: Number, required: true, min: 0, default: 0 },
      // unitPrice: { type: Number, required: true }
    }]
  })
)
