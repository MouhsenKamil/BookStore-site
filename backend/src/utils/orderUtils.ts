import { IBookInCart } from "../models/Cart"


export function mergeBooksByQuantity(books: IBookInCart[]) {
  let acc: { [key: string]: number } = {}

  for (const book of books) {
    const bookId = (book.id as unknown) as string

    if (!(bookId in acc))
      acc[bookId] = book.quantity

    else
      acc[bookId] += book.quantity
  }

  let res: {id: string, quantity: number}[] = []

  for (let key in acc)
    res.push({id: key, quantity: acc[key]})

  return res
}
