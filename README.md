# AI Datasets Explorer

A searchable, filterable browser for AI datasets — powered by live data from the [Geo Knowledge Graph](https://geobrowser.io) (testnet).

---

## What It Does

- Fetches AI dataset metadata live from Geo's GraphQL API at build/request time
- Displays datasets in a responsive card grid with rich metadata (name, description, creator, size, release year, licence, formats)
- Provides fuzzy full-text search (Fuse.js), format and licence filters, and sort controls
- Renders a year-over-year bar chart and a data-format pie chart using Recharts
- Falls back gracefully to a bundled `ai-datasets.json` if the Geo API is unreachable

---

## How It Connects to Geo

All Geo integration lives in [`src/lib/geo-api.ts`](src/lib/geo-api.ts).

| Setting | Value |
|---|---|
| API endpoint | `https://testnet-api.geobrowser.io/graphql` |
| Space ID | `7429dfda5f14718fc6f603622bade857` |
| Protocol | GraphQL over HTTP POST (native `fetch`) |
| Pagination | Fetches all entities automatically, batching requests until complete |

### Data flow

```
Geo GraphQL API (testnet)
  └─ fetchPage() — paginates through all entities in the space
       └─ fetchDatasetsFromGeo() — filters, maps to Dataset[], enriches from fallback JSON
            └─ page.tsx (async server component) — passes Dataset[] to client components
                 ├─ Hero.tsx         — animated stats
                 ├─ Charts.tsx       — year & format charts
                 └─ Explorer.tsx     — search, filter, and DatasetCard grid
```

### What Geo provides

Each entity from Geo exposes:
- `name` and `description` (entity-level fields)
- `valuesList` — key/value property pairs (e.g. `Release date`, `Web URL`, `Size`)

Fields not present in Geo (creator, licence, data formats) are enriched from the bundled fallback JSON, keyed by dataset name.

---

## Tech Stack

| Layer | Library |
|---|---|
| Framework | Next.js 14 (App Router, static export) |
| Language | TypeScript (strict) |
| Styling | Tailwind CSS |
| Animation | Framer Motion |
| Search | Fuse.js (fuzzy) |
| Charts | Recharts |
| Icons | Lucide React |

---

## Getting Started

```bash
# Install dependencies
npm install

# Run the development server
npm run dev
```

---

## Geo Space

The app reads from this specific Geo space:
`https://geobrowser.io/space/7429dfda5f14718fc6f603622bade857`

This space contains the AI dataset entities. Any entity in the space that has both a `name` and a `description` is treated as a dataset.

