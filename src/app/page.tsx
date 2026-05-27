"use client"

import { useEffect, useState } from "react"
import { DollarSign, Star, TrendingDown, TrendingUp, BarChart3, Clock, Zap, Gift } from "lucide-react"
import StatCard from "@/components/StatCard"
import PriceChart from "@/components/PriceChart"
import ExportButton from "@/components/ExportButton"

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
      <div className="flex min-h-screen items-center justify-center">
        <div className="flex flex-col items-center gap-3 text-slate-500">
          <BarChart3 size={32} className="animate-pulse text-blue-400" />
          <p className="text-sm">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  if (products.length === 0) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-20 text-center">
        <DollarSign size={40} className="mx-auto mb-4 text-slate-600" />
        <h1 className="text-xl font-bold text-slate-200">Price Monitor</h1>
        <p className="mt-2 text-sm text-slate-500">No products tracked yet. Run the scraper first.</p>
      </div>
    )
  }

  const validPrices = products.map((p) => p.price).filter((p): p is number => p !== null)
  const minPrice = validPrices.length ? Math.min(...validPrices) : null
  const maxPrice = validPrices.length ? Math.max(...validPrices) : null
  const cheapest = products.find((p) => p.price === minPrice)
  const rated = products.filter((p) => p.rating !== null).sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0))
  const bestRated = rated[0] ?? null
  const mostReviews = products.filter((p) => p.reviews !== null).sort((a, b) => (b.reviews ?? 0) - (a.reviews ?? 0))[0] ?? null

  const chartColors = ["#3b82f6", "#10b981", "#8b5cf6"]

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-white shadow-lg shadow-blue-900/30">
              <DollarSign size={20} />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight text-slate-100">Price Monitor</h1>
              <p className="text-sm text-slate-400">Tracking {products.length} graphics cards</p>
            </div>
          </div>
        </div>
        <ExportButton
          data={products.map((p) => ({
            ASIN: p.asin,
            Title: p.title ?? "",
            Brand: p.brand ?? "",
            Price: p.price ?? "",
            Stock: p.stock ?? "",
            Rating: p.rating ?? "",
            Reviews: p.reviews ?? "",
            "Lowest Price": p.stats.lowest ?? "",
            "Avg Price": p.stats.avg ?? "",
            "Change %": p.stats.change ?? "",
          }))}
          columns={[
            { key: "ASIN", label: "ASIN" },
            { key: "Title", label: "Title" },
            { key: "Brand", label: "Brand" },
            { key: "Price", label: "Price" },
            { key: "Stock", label: "Stock" },
            { key: "Rating", label: "Rating" },
            { key: "Reviews", label: "Reviews" },
            { key: "Lowest Price", label: "Lowest Price" },
            { key: "Avg Price", label: "Avg Price" },
            { key: "Change %", label: "Change %" },
          ]}
          filename="amazon-prices"
        />
      </div>

      <div className="mb-6 h-1 w-20 rounded-full bg-gradient-to-r from-blue-500 to-blue-400" />

      <div className="grid gap-5 sm:grid-cols-3">
        {products.map((p, i) => {
          const isDown = p.stats.change !== null && p.stats.change < 0
          const isUp = p.stats.change !== null && p.stats.change > 0
          const isCheapest = p.price === minPrice
          const isBestRated = p.asin === bestRated?.asin
          const isMostReviews = p.asin === mostReviews?.asin

          return (
            <div
              key={p.asin}
              className="relative rounded-xl border border-slate-700/60 bg-slate-800/50 p-5 shadow-sm transition hover:border-slate-600 hover:bg-slate-800/80"
            >
              {(isCheapest || isBestRated || isMostReviews) && (
                <div className="absolute -top-2.5 right-3 flex gap-1">
                  {isCheapest && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-900/60 px-2 py-0.5 text-[11px] font-semibold text-emerald-300">
                      <Zap size={10} /> Best Price
                    </span>
                  )}
                  {isBestRated && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-amber-900/60 px-2 py-0.5 text-[11px] font-semibold text-amber-300">
                      <Star size={10} className="fill-amber-400 text-amber-400" /> Top Rated
                    </span>
                  )}
                  {isMostReviews && !isBestRated && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-violet-900/60 px-2 py-0.5 text-[11px] font-semibold text-violet-300">
                      <Gift size={10} /> Most Reviews
                    </span>
                  )}
                </div>
              )}
              <div className="mt-1 flex items-start justify-between">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-slate-700 text-[11px] font-bold text-slate-300">{i + 1}</span>
                    <h4 className="text-sm font-semibold text-slate-200 leading-snug line-clamp-2">
                      {p.title ?? "Unknown"}
                    </h4>
                  </div>
                  <p className="mt-0.5 text-xs text-slate-500 font-mono">{p.brand} · {p.asin}</p>
                </div>
              </div>
              <div className="mt-3">
                <span className="text-2xl font-bold tracking-tight text-slate-100">${p.price}</span>
                {p.stock && !p.stock.toLowerCase().includes("out") && (
                  <span className="ml-2 inline-flex items-center rounded-full bg-emerald-900/40 px-2 py-0.5 text-[11px] font-medium text-emerald-300">
                    In stock
                  </span>
                )}
              </div>
              <div className="mt-3 flex items-center gap-3 text-xs text-slate-400">
                {p.rating && (
                  <span className="flex items-center gap-1">
                    <Star size={12} className="fill-amber-400 text-amber-400" />
                    {p.rating}
                  </span>
                )}
                {p.stats.change !== null && (
                  <span className={`flex items-center gap-1 ${isDown ? "text-emerald-400" : "text-red-400"}`}>
                    {isDown ? <TrendingDown size={12} /> : <TrendingUp size={12} />}
                    {Math.abs(p.stats.change)}%
                  </span>
                )}
                {p.reviews && (
                  <span className="text-slate-500">{p.reviews.toLocaleString()} reviews</span>
                )}
              </div>
              <PriceChart
                data={[p.priceHistory]}
                productName={p.title ?? p.asin}
                colors={[chartColors[i]]}
                single
              />
            </div>
          )
        })}
      </div>

      <div className="mt-8 rounded-xl border border-slate-700/60 bg-slate-800/50 p-5 shadow-sm">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-semibold text-slate-200">Price Comparison</h3>
            <p className="text-xs text-slate-500">All products — price history overlay</p>
          </div>
          <div className="flex items-center gap-4 text-xs text-slate-400">
              {products.map((p, i) => (
                <span key={p.asin} className="flex items-center gap-1">
                  <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: chartColors[i] }} />
                  {p.title?.slice(0, 16)}...
                </span>
              ))}
            </div>
          </div>
        </div>
        <PriceChart
          data={products.map((p) => p.priceHistory)}
          productName="Comparison"
          colors={chartColors}
          productNames={products.map((p) => p.title?.slice(0, 20) ?? `Product`)}
        />

      <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <StatCard
          label="Average Price"
          value={minPrice !== null && maxPrice !== null ? `$${Math.round((minPrice + maxPrice) / 2)}` : null}
          accent="blue"
          small
        />
        <StatCard
          label="Price Range"
          value={minPrice !== null && maxPrice !== null ? `$${minPrice} — $${maxPrice}` : null}
          accent="amber"
          small
        />
        <StatCard
          label="Cheapest"
          value={cheapest ? `$${cheapest.price}` : null}
          accent="green"
          small
        />
        <StatCard
          label="Best Rated"
          value={bestRated?.rating ? `${bestRated.rating} ⭐` : null}
          accent="purple"
          small
        />
      </div>

      <div className="mt-6">
        <div className="mb-2 flex items-center justify-between">
          <h3 className="text-sm font-semibold text-slate-200">Comparison Table</h3>
          <span className="text-xs text-slate-500">{products.length} product{products.length !== 1 ? "s" : ""}</span>
        </div>
        <div className="overflow-hidden rounded-xl border border-slate-700/60 shadow-sm">
          <div className="w-full text-sm">
            <div className="flex border-b border-slate-700/60 bg-slate-800/80">
              <div className="w-8 shrink-0 px-2 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-400">#</div>
              <div className="flex-1 px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-400">Product</div>
              <div className="w-20 shrink-0 px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-slate-400">Price</div>
              <div className="w-20 shrink-0 px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-slate-400">Lowest</div>
              <div className="w-16 shrink-0 px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-slate-400">Avg</div>
              <div className="w-20 shrink-0 px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-slate-400">Change</div>
              <div className="w-16 shrink-0 px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-slate-400">Rating</div>
              <div className="w-20 shrink-0 px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-slate-400">Reviews</div>
            </div>
            {products.map((p, i) => (
              <div key={p.asin} className="flex border-b border-slate-800 hover:bg-slate-800/40 transition-colors">
                <div className="flex w-8 shrink-0 items-center justify-center px-2 py-3">
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-slate-700 text-[11px] font-bold text-slate-300">{i + 1}</span>
                </div>
                <div className="flex flex-1 items-center px-4 py-3">
                  <span className="mr-2 h-2 w-2 shrink-0 rounded-full" style={{ backgroundColor: chartColors[i] }} />
                  <span className="font-medium text-slate-200 truncate">{p.title ?? p.asin}</span>
                </div>
                <div className="flex w-20 shrink-0 items-center justify-end px-4 py-3 font-semibold text-slate-100">${p.price}</div>
                <div className="flex w-20 shrink-0 items-center justify-end px-4 py-3 text-slate-400">${p.stats.lowest ?? "—"}</div>
                <div className="flex w-16 shrink-0 items-center justify-end px-4 py-3 text-slate-400">${p.stats.avg?.toFixed(0) ?? "—"}</div>
                <div className={`flex w-20 shrink-0 items-center justify-end px-4 py-3 font-medium ${(p.stats.change ?? 0) < 0 ? "text-emerald-400" : (p.stats.change ?? 0) > 0 ? "text-red-400" : "text-slate-500"}`}>
                  {p.stats.change !== null ? `${p.stats.change > 0 ? "+" : ""}${p.stats.change}%` : "—"}
                </div>
                <div className="flex w-16 shrink-0 items-center justify-end px-4 py-3 text-slate-400">{p.rating ?? "—"}</div>
                <div className="flex w-20 shrink-0 items-center justify-end px-4 py-3 text-slate-400">{p.reviews?.toLocaleString() ?? "—"}</div>
              </div>
            ))}
          </div>
      </div>
      </div>

      <footer className="mt-12 border-t border-slate-800 pt-6 text-center text-xs text-slate-600">
        Data refreshed daily
      </footer>
    </div>
  )
}
