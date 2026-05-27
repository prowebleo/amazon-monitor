import dotenv from "dotenv"
dotenv.config({ path: ".env.local" })

import { scrapeProduct } from "./scraper"
import { initDb } from "../db/schema"
import { saveSnapshot } from "../db/queries"

function getAsins(): string[] {
  const raw = process.env.AMAZON_ASINS ?? ""
  return raw
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean)
}

async function main() {
  await initDb()

  const asins = getAsins()

  if (asins.length === 0) {
    console.error("No ASINs configured. Set AMAZON_ASINS in .env.local")
    console.error("Example: AMAZON_ASINS=B0CT8LQZ47,B0966NLTZS")
    process.exit(1)
  }

  // TODO: add retry logic for rate-limited ASINs
  console.log(`Tracking ${asins.length} product(s)...\n`)

  for (const asin of asins) {
    try {
      console.log(`Scraping ${asin}...`)
      const product = await scrapeProduct(asin)
      await saveSnapshot(product)
      console.log(`  ✓ $${product.price} — ${product.title?.slice(0, 60)}`)
    } catch (error) {
      const msg = error instanceof Error ? error.message : "Unknown error"
      console.error(`  ✗ ${asin}: ${msg}`)
      // don't stop — other ASINs may still work
    }
  }

  console.log("\nDone.")
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
