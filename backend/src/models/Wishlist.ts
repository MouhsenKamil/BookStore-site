import mongoose, { Schema, Document } from "mongoose"
import { ICart } from "./Cart"

export interface IWishlist extends ICart {}

export type WishlistDoc = IWishlist & Document

export const Wishlist = mongoose.model(
  "wishlists",
  new Schema<WishlistDoc>({
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    books: [{ type: Schema.Types.ObjectId, ref: 'Book' }]
  })
)
