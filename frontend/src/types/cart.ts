// import { IBook } from "./book"


export interface IBookInCart {
  _id: string
  title: string
  price: number
  unitsInStock: number
  coverImage: string
  quantity: number
}


export interface ICart {
  user: string
  books: IBookInCart[]
}

// export interface ICartWithBook {
//   user: string
//   books: {
//     obj: IBook
//     quantity: number
//   }[]
// }
