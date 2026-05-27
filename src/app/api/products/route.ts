import { initDb } from "@/db/schema"
import { getAllProducts, getHistory } from "@/db/queries"

export async function GET() {
  await initDb()

  const products = await getAllProducts()
  const result = []

  for (const p of products) {
    const history = await getHistory(p.asin)
    const prices = history.map((h) => ({
      date: h.scraped_at,
      price: h.price,
    }))

    const numericPrices = prices
      .map((p) => p.price)
      .filter((p): p is number => p !== null)

    const lowest = numericPrices.length
      ? Math.min(...numericPrices)
      : null

    const avg =
      numericPrices.length
        ? numericPrices.reduce((a, b) => a + b, 0) / numericPrices.length
        : null

    const latest = numericPrices[numericPrices.length - 1] ?? null
    const first = numericPrices[0] ?? null
    const change =
      latest !== null && first !== null
        ? Number(((latest - first) / first * 100).toFixed(1))
        : null

    result.push({
      asin: p.asin,
      title: p.title,
      brand: p.brand,
      price: p.price,
      stock: p.stock,
      rating: p.rating,
      reviews: p.reviews_count,
      currency: p.currency,
      lastScraped: p.scraped_at,
      stats: { lowest, avg, change, totalSnapshots: history.length },
      priceHistory: prices,
    })
  }

  return Response.json({ products: result })
}
