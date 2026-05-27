let _db: any = null

export async function getDb() {
  if (!_db) {
    const tursoUrl = process.env.TURSO_URL
    const localUrl = process.env.DATABASE_URL ?? "file:./data.db"

    if (tursoUrl) {
      const { createClient } = await import("@libsql/client/web")
      _db = createClient({
        url: tursoUrl,
        authToken: process.env.TURSO_AUTH_TOKEN,
      })
    } else {
      const { createClient } = await import("@libsql/client")
      _db = createClient({ url: localUrl })
    }
  }
  return _db
}
