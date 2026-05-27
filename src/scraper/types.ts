export type ProductSnapshot = {
  asin: string
  title: string | null
  price: number | null
  originalPrice: number | null
  stock: string | null
  brand: string | null
  rating: number | null
  reviewsCount: number | null
  category: string | null
  url: string | null
  currency: string | null
}

export type RawProduct = {
  asin?: string
  title?: string
  product_name?: string
  price?: number | string
  price_initial?: number | string
  stock?: string
  brand?: string
  rating?: number | string
  reviews_count?: number | string
  category?: string
  url?: string
  currency?: string
  [key: string]: unknown
}

export type WrappedResult = {
  content?: { results?: RawProduct }
}

export type ScraperResponse = {
  results?: WrappedResult[] | RawProduct
  errors?: unknown[]
  status_code?: number
  task_id?: string
}
