import { IBookInCart } from "./cart"


export type IBookInWishlist = Omit<IBookInCart, 'quantity'>

export interface IWishlist {
  user: string
  books: IBookInWishlist[]
}
