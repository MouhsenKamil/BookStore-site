import { IBook } from "./book"

export interface ICart {
  user: string
  books: {
    id: number
    name: string
    quantity: number
    unitPrice: number
  }[]
}

export interface ICartWithBook {
  user: string
  books: {
    obj: IBook
    quantity: number
  }[]
}
