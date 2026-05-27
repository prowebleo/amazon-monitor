import { getDb } from "./client"
import type { ProductSnapshot } from "@/scraper/types"

type SnapshotRow = {
  id: number
  asin: string
  title: string | null
  price: number | null
  original_price: number | null
  stock: string | null
  brand: string | null
  rating: number | null
  reviews_count: number | null
  currency: string | null
  scraped_at: string
}

export async function saveSnapshot(product: ProductSnapshot) {
  const db = await getDb()
  await db.execute({
    sql: `INSERT INTO snapshots (asin, title, price, original_price, stock, brand, rating, reviews_count, currency)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    args: [
      product.asin,
      product.title,
      product.price,
      product.originalPrice,
      product.stock,
      product.brand,
      product.rating,
      product.reviewsCount,
      product.currency,
    ],
  })
}

export async function getHistory(asin: string): Promise<SnapshotRow[]> {
  const db = getDb()
  const result = await db.execute({
    sql: `SELECT * FROM snapshots WHERE asin = ? ORDER BY scraped_at ASC`,
    args: [asin],
  })
  return result.rows as unknown as SnapshotRow[]
}

export async function getLatest(asin: string): Promise<SnapshotRow | null> {
  const db = getDb()
  const result = await db.execute({
    sql: `SELECT * FROM snapshots WHERE asin = ? ORDER BY scraped_at DESC LIMIT 1`,
    args: [asin],
  })
  const rows = result.rows as unknown as SnapshotRow[]
  return rows[0] ?? null
}

export async function getAllProducts(): Promise<SnapshotRow[]> {
  const db = getDb()
  const result = await db.execute(`
    SELECT * FROM snapshots WHERE id IN (
      SELECT MAX(id) FROM snapshots GROUP BY asin
    ) ORDER BY scraped_at DESC
  `)
  return result.rows as unknown as SnapshotRow[]
}
