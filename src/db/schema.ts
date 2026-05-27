import { getDb } from "./client"

export async function initDb() {
  const db = await getDb()
  await db.execute(`
    CREATE TABLE IF NOT EXISTS snapshots (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      asin TEXT NOT NULL,
      title TEXT,
      price REAL,
      original_price REAL,
      stock TEXT,
      brand TEXT,
      rating REAL,
      reviews_count INTEGER,
      currency TEXT,
      scraped_at TEXT NOT NULL DEFAULT (datetime('now'))
    )
  `)
  await db.execute(
    `CREATE INDEX IF NOT EXISTS idx_snapshots_asin ON snapshots(asin)`
  )
}
