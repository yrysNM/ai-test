# AI Іздеу MVP

Almaty flower search with AI matching and **WhatsApp handoff** only. No on-site checkout, courier, or 500 ₸ fee collection.

**Stack:** Nuxt 3 (`apps/web`) · Express + TypeScript (`apps/api`) · Ollama Cloud

**Design:** [Superdesign canvas](docs/superdesign-canvas.md)

## Screens

| Route | Purpose |
|-------|---------|
| `/` | Home — brand + natural-language search |
| `/results` | Ranked offers (prices required) |
| `/preview` | WhatsApp message draft → `wa.me` |
| `/shop` | Shop cabinet stub |

UI: Kazakh + Russian. Brand: **AI Іздеу**.

## Setup

```bash
git clone https://github.com/yrysNM/ai-test.git
cd ai-test
npm install
```

Copy env (names only in `.env.example`):

```bash
cp .env.example apps/api/.env
# set OLLAMA_API_KEY, OLLAMA_HOST, OLLAMA_MODEL
```

Optional for Nuxt: create `apps/web/.env` with `NUXT_PUBLIC_API_BASE=http://localhost:3001`.

## Run

Terminal 1 — API (`:3001`):

```bash
npm run dev:api
```

Terminal 2 — Web (`:3000`):

```bash
npm run dev:web
```

Open http://localhost:3000

## API

- `GET /health`
- `GET /api/products?q=&category=flowers&city=almaty`
- `POST /api/search` `{ "query": "...", "lang": "kk" | "ru" }`
- `POST /api/whatsapp-preview` `{ "offerId": "...", "query": "...", "lang": "kk" | "ru" }`

AI must **not invent missing prices** — offers without a price are omitted.

## Smoke

With API running and a valid `OLLAMA_API_KEY`:

```bash
curl -s http://localhost:3001/health
curl -s -X POST http://localhost:3001/api/search -H "content-type: application/json" -d "{\"query\":\"қызғылт раушан 15000\",\"lang\":\"kk\"}"
```

## Product rules

- Search + WhatsApp only
- Pilot: Almaty flowers
- No payment UI on site
