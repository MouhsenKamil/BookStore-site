export interface GetSearchResultsProps<T> {
  query: string
  limit?: number
  fields?: (keyof T)[]
  sort?: keyof Omit<T, '_id'>
  order?: 'asc' | 'desc'
}
