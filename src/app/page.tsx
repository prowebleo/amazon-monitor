"use client"

import { useEffect, useState } from "react"
import KpiCard from "@/components/KpiCard"
import PriceChart from "@/components/PriceChart"

type Product = {
  asin: string
  title: string | null
  brand: string | null
  price: number | null
  stock: string | null
  rating: number | null
  reviews: number | null
  currency: string | null
  lastScraped: string
  stats: {
    lowest: number | null
    avg: number | null
    change: number | null
    totalSnapshots: number
  }
  priceHistory: { date: string; price: number | null }[]
}

export default function Home() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch("/api/products")
      .then((r) => r.json())
      .then((data) => setProducts(data.products ?? []))
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center text-gray-500">
        Loading...
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <header className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">
          Price Monitor
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          Automated Amazon price tracking & analytics
        </p>
      </header>

      {products.length === 0 ? (
        <div className="flex h-64 items-center justify-center rounded-xl border border-dashed border-gray-300 text-sm text-gray-400">
          No products tracked yet. Run the scraper first.
        </div>
      ) : (
        products.map((p) => (
          <div key={p.asin} className="mb-10 space-y-6">
            <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">
                    {p.title}
                  </h2>
                  <p className="mt-0.5 text-sm text-gray-500">
                    {p.brand} — {p.asin}
                  </p>
                </div>
                <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700">
                  {p.stock ?? "Unknown"}
                </span>
              </div>

              <div className="mt-1 flex items-center gap-3 text-sm text-gray-500">
                {p.rating && (
                  <span>⭐ {p.rating} ({p.reviews} reviews)</span>
                )}
                <span>Snapshots: {p.stats.totalSnapshots}</span>
              </div>
            </div>

            <div className="grid grid-cols-4 gap-4">
              <KpiCard
                label="Current Price"
                value={p.price !== null ? `$${p.price}` : null}
                subtitle={p.lastScraped ? `⏱ ${new Date(p.lastScraped).toLocaleString("en")}` : undefined}
              />
              <KpiCard
                label="Lowest Price"
                value={p.stats.lowest !== null ? `$${p.stats.lowest}` : null}
                color="green"
              />
              <KpiCard
                label="Average Price"
                value={p.stats.avg !== null ? `$${p.stats.avg.toFixed(2)}` : null}
              />
              <KpiCard
                label="Total Change"
                value={
                  p.stats.change !== null
                    ? `${p.stats.change > 0 ? "+" : ""}${p.stats.change}%`
                    : null
                }
                color={p.stats.change !== null ? (p.stats.change > 0 ? "red" : "green") : "default"}
                subtitle={
                  p.stats.change !== null
                    ? p.stats.change > 0
                      ? "▲ Up from start"
                      : "▼ Down from start"
                    : undefined
                }
              />
            </div>

            <PriceChart data={p.priceHistory} productName={p.title ?? p.asin} />
          </div>
        ))
      )}
    </div>
  )
}
