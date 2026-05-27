import { Download } from "lucide-react"

type Column = { key: string; label: string }

type Props = {
  data: Record<string, any>[]
  columns: Column[]
  filename: string
}

export default function ExportButton({ data, columns, filename }: Props) {
  function handleExport() {
    const header = columns.map((c) => `"${c.label}"`).join(",")
    const rows = data.map((row) =>
      columns.map((c) => `"${row[c.key] ?? ""}"`).join(",")
    )
    const csv = [header, ...rows].join("\n")
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `${filename}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <button
      onClick={handleExport}
      className="inline-flex items-center gap-1.5 rounded-lg border border-slate-600 px-3 py-1.5 text-xs font-medium text-slate-300 transition hover:border-slate-500 hover:bg-slate-700/50 hover:text-slate-100"
    >
      <Download size={14} />
      CSV
    </button>
  )
}
