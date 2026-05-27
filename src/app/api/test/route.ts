import { scrapeProduct } from "@/scraper/decodo"
import { initDb } from "@/db/schema"
import { saveSnapshot, getHistory } from "@/db/queries"

export async function GET() {
  try {
    await initDb()

    const product = await scrapeProduct("B0CT8LQZ47")
    await saveSnapshot(product)

    const history = await getHistory("B0CT8LQZ47")

    return Response.json({
      success: true,
      saved: product,
      total_snapshots: history.length,
    })
  } catch (error) {
    const message = error instanceof Error ? error.message : "Error desconocido"
    return Response.json({ success: false, error: message }, { status: 500 })
  }
}
