import type { ProductSnapshot, ScraperResponse, RawProduct } from "./types"

const API_URL = process.env.SCRAPER_API_URL ?? ""

function getAuth(): string {
  const token = process.env.SCRAPER_API_TOKEN
  if (!token) throw new Error("Falta SCRAPER_API_TOKEN en .env.local")
  return `Basic ${token}`
}

function toNumber(value: unknown): number | null {
  if (typeof value === "number") return Number.isFinite(value) ? value : null
  if (typeof value !== "string") return null
  const cleaned = value.replace(/[^\d.,-]/g, "").replace(",", ".")
  const parsed = Number(cleaned)
  return Number.isFinite(parsed) ? parsed : null
}

function toInteger(value: unknown): number | null {
  const n = toNumber(value)
  return n !== null ? Math.round(n) : null
}

function extractProduct(raw: RawProduct, asin: string): ProductSnapshot {
  return {
    asin: raw.asin ?? asin,
    title: raw.title ?? raw.product_name ?? null,
    price: toNumber(raw.price),
    originalPrice: toNumber(raw.price_initial),
    stock: raw.stock ?? null,
    brand: raw.brand ?? null,
    rating: toNumber(raw.rating),
    reviewsCount: toInteger(raw.reviews_count),
    category: raw.category ?? null,
    url: raw.url ?? null,
    currency: raw.currency ?? null,
  }
}

function unwrapResponse(data: ScraperResponse): RawProduct {
  if (Array.isArray(data.results)) {
    return data.results[0]?.content?.results ?? {}
  }
  return (data.results as RawProduct) ?? {}
}

export async function scrapeProduct(
  asin: string,
  domain = "com"
): Promise<ProductSnapshot> {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: getAuth(),
    },
    body: JSON.stringify({
      target: "amazon_product",
      query: asin,
      domain,
      parse: true,
    }),
  })

  if (!response.ok) {
    throw new Error(
      `Scraper error ${response.status}: ${await response.text()}`
    )
  }

  const data: ScraperResponse = await response.json()
  const raw = unwrapResponse(data)
  return extractProduct(raw, asin)
}
