export interface IBook {
  _id: string
  authorNames: string[]
  title: string
  subtitle: string | null
  lang: string[]
  categories: string[]
  coverImage: string
  description: string
  price: number
  unitsInStock: number
  quantity: number
  seller: string
}

export interface IBookWithSellerName extends IBook {
  sellerName: string
}
