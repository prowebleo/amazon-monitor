import { TrendingUp, TrendingDown, Minus } from "lucide-react"

type Props = {
  label: string
  value: string | number | null
  trend?: "up" | "down" | "neutral"
  trendLabel?: string
  accent?: "blue" | "green" | "red" | "amber" | "purple"
  small?: boolean
}

const accentStyles: Record<string, string> = {
  blue: "border-l-blue-500 bg-blue-950/40",
  green: "border-l-emerald-500 bg-emerald-950/40",
  red: "border-l-red-500 bg-red-950/40",
  amber: "border-l-amber-500 bg-amber-950/40",
  purple: "border-l-violet-500 bg-violet-950/40",
}

const valueStyles: Record<string, string> = {
  blue: "text-blue-400",
  green: "text-emerald-400",
  red: "text-red-400",
  amber: "text-amber-400",
  purple: "text-violet-400",
}

export default function StatCard({ label, value, trend, trendLabel, accent = "blue", small }: Props) {
  const TrendIcon = trend === "up" ? TrendingUp : trend === "down" ? TrendingDown : Minus
  const trendColor = trend === "up" ? "text-emerald-400" : trend === "down" ? "text-red-400" : "text-slate-500"

  return (
    <div className={`relative overflow-hidden rounded-xl border border-slate-700/60 bg-slate-800/80 shadow-sm transition hover:border-slate-600 ${accentStyles[accent]} ${small ? "border-l-2 p-3" : "border-l-4 p-4"}`}>
      <p className={`font-semibold uppercase tracking-wider text-slate-400 ${small ? "text-[10px]" : "text-xs"}`}>{label}</p>
      <p className={`mt-0.5 font-bold tracking-tight ${valueStyles[accent]} ${small ? "text-base" : "text-xl"}`}>
        {value ?? "—"}
      </p>
      {trend && (
        <p className={`mt-1 flex items-center gap-1 font-medium ${trendColor} ${small ? "text-[10px]" : "text-xs"}`}>
          <TrendIcon size={small ? 11 : 14} />
          {trendLabel ?? trend}
        </p>
      )}
    </div>
  )
}
