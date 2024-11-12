export interface IBook {
  id?: string
  authorName: Array<string>
  title: string
  subtitle: string | null
  lang: Array<string>
  categories: Array<string>
  coverImage: string | null
  description: string | null
  price: number
  unitsInStock?: number
  seller: string
}

export interface IBookWithSellerName extends IBook {
  sellerName: string
}
