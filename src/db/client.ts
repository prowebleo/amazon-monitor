import { createClient, type Client } from "@libsql/client"

let _db: Client | null = null

export function getDb(): Client {
  if (!_db) {
    const url = process.env.TURSO_URL ?? process.env.DATABASE_URL ?? "file:./data.db"
    const authToken = url.startsWith("libsql://") ? process.env.TURSO_AUTH_TOKEN : undefined

    if (url.startsWith("libsql://") && !authToken) {
      console.warn("Turso URL detected but TURSO_AUTH_TOKEN is missing")
    }

    _db = createClient({ url, authToken })
  }
  return _db
}
