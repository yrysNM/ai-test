import { readFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import type { Offer, Product, SearchIntent, Shop } from './types.js'

const root = join(dirname(fileURLToPath(import.meta.url)), '..', 'data')

export const shops: Shop[] = JSON.parse(readFileSync(join(root, 'shops.json'), 'utf8'))
export const products: Product[] = JSON.parse(readFileSync(join(root, 'products.json'), 'utf8'))

const shopById = new Map(shops.map((s) => [s.id, s]))

export function listProducts(opts: {
  q?: string
  category?: string
  city?: string
}): Array<Product & { shop?: Shop }> {
  const q = (opts.q ?? '').trim().toLowerCase()
  return products
    .filter((p) => {
      if (opts.category && p.category !== opts.category) return false
      if (opts.city && p.city !== opts.city.toLowerCase()) return false
      if (p.priceKzt == null) return false
      if (!q) return true
      const hay = `${p.title} ${p.titleRu} ${p.tags.join(' ')}`.toLowerCase()
      return hay.includes(q)
    })
    .map((p) => ({ ...p, shop: shopById.get(p.shopId) }))
}

function scoreProduct(p: Product, intent: SearchIntent): { score: number; reason: string } {
  let score = 0
  const reasons: string[] = []
  const hay = `${p.title} ${p.titleRu} ${p.tags.join(' ')} ${p.occasion.join(' ')}`.toLowerCase()
  const q = intent.rawQuery.toLowerCase()

  if (intent.productType) {
    const t = intent.productType.toLowerCase()
    if (hay.includes(t) || q.split(/\s+/).some((w) => w.length > 2 && hay.includes(w))) {
      score += 40
      reasons.push(intent.productType)
    }
  }

  if (intent.color) {
    const c = intent.color.toLowerCase()
    if (hay.includes(c)) {
      score += 25
      reasons.push(intent.color)
    }
  }

  if (intent.occasion) {
    const o = intent.occasion.toLowerCase()
    if (hay.includes(o) || p.occasion.some((x) => x.toLowerCase().includes(o))) {
      score += 15
      reasons.push(intent.occasion)
    }
  }

  if (intent.budgetMax != null && p.priceKzt != null) {
    if (p.priceKzt <= intent.budgetMax) {
      score += 30
      reasons.push(`≤ ${intent.budgetMax} ₸`)
    } else {
      // Over budget — exclude from ranking (do not invent discounts)
      return { score: 0, reason: '' }
    }
  }

  for (const word of q.split(/\s+/)) {
    if (word.length < 3) continue
    if (hay.includes(word)) score += 5
  }

  if (score <= 0 && q) {
    // weak lexical fallback so empty intent still surfaces something relevant
    for (const word of q.split(/\s+/)) {
      if (word.length >= 4 && hay.includes(word)) {
        score += 10
        reasons.push(word)
      }
    }
  }

  return {
    score,
    reason: reasons.length ? reasons.join(' · ') : 'каталог',
  }
}

export function matchOffers(intent: SearchIntent, lang: 'kk' | 'ru'): Offer[] {
  const city = (intent.city || 'almaty').toLowerCase()
  const ranked: Offer[] = []

  for (const p of products) {
    if (p.priceKzt == null) continue // never invent / never show missing prices
    if (p.city !== city) continue
    if (p.category !== 'flowers') continue

    const shop = shopById.get(p.shopId)
    if (!shop) continue

    const { score, reason } = scoreProduct(p, intent)
    if (score <= 0) continue

    ranked.push({
      offerId: `offer-${p.id}`,
      productId: p.id,
      shopId: shop.id,
      shopName: lang === 'kk' ? shop.nameKk : shop.name,
      shopAddress: shop.address,
      whatsapp: shop.whatsapp,
      title: p.title,
      titleRu: p.titleRu,
      priceKzt: p.priceKzt,
      matchReason: reason,
      score,
    })
  }

  return ranked.sort((a, b) => b.score - a.score || a.priceKzt - b.priceKzt).slice(0, 12)
}

export function getOfferById(offerId: string, lang: 'kk' | 'ru'): Offer | null {
  const productId = offerId.replace(/^offer-/, '')
  const p = products.find((x) => x.id === productId)
  if (!p || p.priceKzt == null) return null
  const shop = shopById.get(p.shopId)
  if (!shop) return null
  return {
    offerId,
    productId: p.id,
    shopId: shop.id,
    shopName: lang === 'kk' ? shop.nameKk : shop.name,
    shopAddress: shop.address,
    whatsapp: shop.whatsapp,
    title: p.title,
    titleRu: p.titleRu,
    priceKzt: p.priceKzt,
    matchReason: '',
    score: 0,
  }
}

export function getShopCabinet(shopId: string) {
  const shop = shopById.get(shopId) ?? shops[0]
  if (!shop) return null
  const catalog = products
    .filter((p) => p.shopId === shop.id && p.priceKzt != null)
    .map((p) => ({
      id: p.id,
      title: p.title,
      titleRu: p.titleRu,
      priceKzt: p.priceKzt as number,
    }))
  return { shop, products: catalog }
}
