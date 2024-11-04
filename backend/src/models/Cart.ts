import mongoose, { Schema, Types, Document } from "mongoose";

export interface ICart {
  user: Types.ObjectId
  books: {
    id: Types.ObjectId
    quantity: number
    unitPrice: number
  }[]
}


export type CartDoc = ICart & Document

export const Cart = mongoose.model<CartDoc>(
  'carts',
  new Schema<CartDoc>({
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    books: [{
      id: { type: Schema.Types.ObjectId, ref: 'Book', required: true },
      quantity: { type: Number, required: true },
      unitPrice: { type: Number, required: true }
    }]
  })
)
