# Amazon Price Monitor

Automated price tracking dashboard for graphics cards — scrapes Amazon prices daily and visualizes historical trends.

![Dashboard Screenshot](https://github.com/prowebleo/amazon-monitor/raw/main/screenshot.png)

## Features

- **Multi-product comparison** — Side-by-side price history overlay chart
- **Historical tracking** — Price snapshots stored in Turso (SQLite edge DB)
- **Smart badges** — Auto-tags Best Price, Top Rated, Most Reviews per scan
- **CSV export** — Download price data as CSV with one click
- **Scheduled scraping** — GitHub Action runs daily at 6 AM UTC

## Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 15 (App Router) |
| Database | Turso (libSQL) |
| Charts | Recharts |
| Scraping | Automated web scraping pipeline |
| Scheduling | GitHub Actions |
| Deployment | Vercel |

## Live Demo

**[amazon-monitor-eosin.vercel.app](https://amazon-monitor-eosin.vercel.app)**

## Local Development

```bash
npm install
cp .env.example .env
# fill in your API keys
npm run dev
```

## Run Scraper

```bash
npm run scrape
```
