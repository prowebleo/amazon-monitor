"use client"

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Legend,
} from "recharts"

type Props = {
  data: { date: string; price: number | null }[][] | { date: string; price: number | null }[]
  productName: string
  colors?: string[]
  single?: boolean
}

export default function PriceChart({ data, productName, colors = ["#3b82f6"], single }: Props) {
  const isOverlay = Array.isArray(data[0])
  const series = isOverlay ? (data as { date: string; price: number | null }[][]) : [data as { date: string; price: number | null }[]]

  const mergedMap = new Map<string, Record<string, any>>()
  series.forEach((s, si) => {
    s.filter((d) => d.price !== null).forEach((d) => {
      const dt = new Date(d.date)
      const key = dt.toISOString()
      if (!mergedMap.has(key)) {
        mergedMap.set(key, {
          date: key,
          label: dt.toLocaleDateString("en", { month: "short", day: "numeric" }) +
            " " + dt.toLocaleTimeString("en", { hour: "2-digit", minute: "2-digit" }),
        })
      }
      mergedMap.get(key)![`price${si}`] = d.price
    })
  })
  const chartData = Array.from(mergedMap.values()).sort((a, b) =>
    new Date(a.date).getTime() - new Date(b.date).getTime()
  )

  if (chartData.length === 0) {
    return (
      <div className="flex h-64 items-center justify-center rounded-xl border border-slate-700/60 bg-slate-800/50 text-sm text-slate-500">
        Not enough history for chart
      </div>
    )
  }

  const allPrices = series.flatMap((s) => s.map((d) => d.price).filter((p): p is number => p !== null))
  const min = Math.min(...allPrices)
  const max = Math.max(...allPrices)
  const padding = (max - min) * 0.1 || 5

  if (single) {
    return (
      <div className="rounded-xl border border-slate-700/60 bg-slate-800/50 p-4 shadow-sm">
        <p className="mb-2 text-xs font-medium text-slate-400 line-clamp-1">{productName}</p>
        <ResponsiveContainer width="100%" height={160}>
          <AreaChart data={chartData}>
            <defs>
              <linearGradient id={`gradSingle`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={colors[0]} stopOpacity={0.15} />
                <stop offset="100%" stopColor={colors[0]} stopOpacity={0.01} />
              </linearGradient>
            </defs>
            <XAxis dataKey="label" hide />
            <YAxis hide domain={[min - padding, max + padding]} />
            <Tooltip
              formatter={(value: any) => [`$${value}`, "Price"]}
              contentStyle={{
                borderRadius: "8px",
                border: "1px solid #334155",
                fontSize: "12px",
                padding: "4px 8px",
                background: "#1e293b",
                color: "#e2e8f0",
              }}
            />
            <Area
              type="monotone"
              dataKey="price0"
              stroke={colors[0]}
              strokeWidth={1.5}
              fill={`url(#gradSingle)`}
              dot={false}
              activeDot={{ r: 3 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    )
  }

  return (
    <div className="rounded-xl border border-slate-700/60 bg-slate-800/50 p-5 shadow-sm">
      {!isOverlay && (
        <div className="mb-4">
          <h3 className="text-sm font-semibold text-slate-200">Price History</h3>
          <p className="text-xs text-slate-500">{productName}</p>
        </div>
      )}
      <ResponsiveContainer width="100%" height={isOverlay ? 300 : 300}>
        <AreaChart data={chartData}>
          <defs>
            {colors.map((c, i) => (
              <linearGradient key={i} id={`grad${i}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={c} stopOpacity={0.15} />
                <stop offset="100%" stopColor={c} stopOpacity={0.01} />
              </linearGradient>
            ))}
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
          <XAxis dataKey="label" tick={{ fontSize: 11, fill: "#64748b" }} axisLine={false} tickLine={false} />
          <YAxis
            domain={[min - padding, max + padding]}
            tick={{ fontSize: 11, fill: "#64748b" }}
            axisLine={false}
            tickLine={false}
            tickFormatter={(v) => `$${v}`}
            width={50}
          />
          <Tooltip
            contentStyle={{
              borderRadius: "10px",
              border: "1px solid #334155",
              fontSize: "13px",
              background: "#1e293b",
              color: "#e2e8f0",
              boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.3)",
            }}
          />
          {isOverlay && <Legend wrapperStyle={{ fontSize: "11px", paddingTop: "4px", color: "#94a3b8" }} />}
          {series.map((_, i) => (
            <Area
              key={i}
              type="monotone"
              dataKey={`price${i}`}
              stroke={colors[i % colors.length]}
              strokeWidth={2}
              fill={`url(#grad${i})`}
              dot={false}
              activeDot={{ r: 4, stroke: "#0f172a", strokeWidth: 2 }}
              name={isOverlay ? `Product ${i + 1}` : "Price"}
            />
          ))}
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}
