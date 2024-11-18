import mongoose, { Types, Schema, Document } from "mongoose"


export interface IWishlist {
  user: Types.ObjectId
  books: Types.ObjectId[]
}

type WishlistDoc = IWishlist & Document

export const Wishlist = mongoose.model(
  "wishlists",
  new Schema<WishlistDoc>({
    user: {
      type: Schema.Types.ObjectId, ref: 'Customer',
      required: true, unique: true, index: true
    },
    books: [{ type: Schema.Types.ObjectId, ref: 'Book', required: true }]
  })
)
