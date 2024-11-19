import { IBook } from "./book"


export interface IBookInWishlist {
  _id: string
  title: string
  price: number
  unitsInStock: number
  coverImage: string
  quantity: number
}


export interface IwIBookInWishlist {
  user: string
  books: IBookInWishlist[]
}

export interface IwIBookInWishlistWithBook {
  user: string
  books: {
    obj: IBook
    quantity: number
  }[]
}
