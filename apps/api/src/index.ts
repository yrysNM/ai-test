import cors from 'cors'
import dotenv from 'dotenv'
import express from 'express'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { z } from 'zod'
import {
  getOfferById,
  getShopCabinet,
  listProducts,
  matchOffers,
} from './catalog.js'
import { draftWhatsAppMessage, heuristicIntent, parseSearchIntent } from './ollama.js'

dotenv.config({ path: join(dirname(fileURLToPath(import.meta.url)), '..', '.env') })
dotenv.config()

const app = express()
const port = Number(process.env.PORT || 3001)
const corsOrigin = process.env.CORS_ORIGIN || 'http://localhost:3000'

app.use(
  cors({
    origin: corsOrigin.split(',').map((s) => s.trim()),
  }),
)
app.use(express.json({ limit: '256kb' }))

app.get('/health', (_req, res) => {
  const hasKey = Boolean(process.env.OLLAMA_API_KEY?.trim())
  res.json({
    ok: true,
    service: 'ai-izdeu-api',
    ollamaConfigured: hasKey,
    model: process.env.OLLAMA_MODEL || null,
  })
})

app.get('/api/products', (req, res) => {
  const q = typeof req.query.q === 'string' ? req.query.q : undefined
  const category = typeof req.query.category === 'string' ? req.query.category : 'flowers'
  const city = typeof req.query.city === 'string' ? req.query.city : 'almaty'
  const items = listProducts({ q, category, city }).map((p) => ({
    id: p.id,
    shopId: p.shopId,
    shopName: p.shop?.name,
    title: p.title,
    titleRu: p.titleRu,
    priceKzt: p.priceKzt,
    city: p.city,
    category: p.category,
  }))
  res.json({ items })
})

const searchSchema = z.object({
  query: z.string().min(1).max(500),
  lang: z.enum(['kk', 'ru']).default('kk'),
})

app.post('/api/search', async (req, res) => {
  const parsed = searchSchema.safeParse(req.body)
  if (!parsed.success) {
    res.status(400).json({ error: 'Invalid body', details: parsed.error.flatten() })
    return
  }
  const { query, lang } = parsed.data

  let intent
  let provider: 'ollama' | 'heuristic' = 'ollama'
  try {
    if (!process.env.OLLAMA_API_KEY?.trim()) {
      throw new Error('OLLAMA_API_KEY missing')
    }
    intent = await parseSearchIntent(query, lang)
  } catch {
    provider = 'heuristic'
    intent = heuristicIntent(query)
  }

  const offers = matchOffers(intent, lang)
  res.json({
    query,
    lang,
    intent,
    provider,
    offers,
  })
})

const previewSchema = z.object({
  offerId: z.string().min(1),
  query: z.string().min(1).max(500),
  lang: z.enum(['kk', 'ru']).default('kk'),
})

app.post('/api/whatsapp-preview', async (req, res) => {
  const parsed = previewSchema.safeParse(req.body)
  if (!parsed.success) {
    res.status(400).json({ error: 'Invalid body', details: parsed.error.flatten() })
    return
  }
  const { offerId, query, lang } = parsed.data
  const offer = getOfferById(offerId, lang)
  if (!offer) {
    res.status(404).json({ error: 'Offer not found or missing price' })
    return
  }

  const message = await draftWhatsAppMessage({
    query,
    lang,
    shopName: offer.shopName,
    productTitle: lang === 'kk' ? offer.title : offer.titleRu,
    priceKzt: offer.priceKzt,
  })

  const waUrl = `https://wa.me/${offer.whatsapp}?text=${encodeURIComponent(message)}`

  res.json({
    offer,
    message,
    waUrl,
  })
})

app.get('/api/shop/:shopId?', (req, res) => {
  const shopId = req.params.shopId || 'shop-gul-almaty'
  const cabinet = getShopCabinet(shopId)
  if (!cabinet) {
    res.status(404).json({ error: 'Shop not found' })
    return
  }
  res.json(cabinet)
})

app.listen(port, () => {
  console.log(`AI Іздеу API listening on http://localhost:${port}`)
})
