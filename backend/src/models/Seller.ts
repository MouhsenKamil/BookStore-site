// import { Schema, Types } from 'mongoose'
// import { User, IUser, UserType } from "./User.ts"

// // export interface ISeller extends IUser {
// //   booksLent: {
// //     bookId: Types.ObjectId
// //     quantity: number
// //     unitPrice: number
// //   }[]
// // }

// export interface ISeller extends IUser {}

// export const Seller = User.discriminator(
//   UserType.SELLER,
//   new Schema<ISeller>({
//     // booksLent: [{
//     //   bookId: { type: Schema.Types.ObjectId, required: true },
//     //   quantity: { type: Number, required: true },
//     //   unitPrice: { type: Number, required: true }
//     // }]
//   })
// )
