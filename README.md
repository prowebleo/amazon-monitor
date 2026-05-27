# Amazon Price Monitor

Tracks GPU prices from Amazon and visualizes historical trends. Three cards side by side with price history, a comparison overlay chart, and a stats table. Runs daily via GitHub Actions.

## Why

Wanted a quick way to spot price drops on specific GPUs without refreshing Amazon pages. The scraper runs at 6 AM UTC, stores snapshots in Turso, and the dashboard updates automatically.

## Stack

Next.js 15, Turso (libSQL), Recharts, GitHub Actions, Vercel

## Live

**[amazon-monitor-eosin.vercel.app](https://amazon-monitor-eosin.vercel.app)**

## Running locally

```bash
npm install
# copy .env.example to .env.local and fill in your keys
npm run dev
npm run scrape  # fetches fresh data
```
