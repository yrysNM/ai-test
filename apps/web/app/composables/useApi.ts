export type Offer = {
  offerId: string
  productId: string
  shopId: string
  shopName: string
  shopAddress: string
  whatsapp: string
  title: string
  titleRu: string
  priceKzt: number
  matchReason: string
  score: number
}

export type SearchResponse = {
  query: string
  lang: 'kk' | 'ru'
  intent: {
    productType: string | null
    color: string | null
    budgetMax: number | null
    occasion: string | null
    city: string
  }
  provider: 'ollama' | 'heuristic'
  offers: Offer[]
}

export type WhatsAppPreviewResponse = {
  offer: Offer
  message: string
  waUrl: string
}

export type ShopCabinet = {
  shop: {
    id: string
    name: string
    nameKk: string
    address: string
    whatsapp: string
  }
  products: Array<{
    id: string
    title: string
    titleRu: string
    priceKzt: number
  }>
}

export function useApi() {
  const config = useRuntimeConfig()
  const base = String(config.public.apiBase).replace(/\/$/, '')

  async function apiFetch<T>(path: string, init?: RequestInit): Promise<T> {
    const res = await fetch(`${base}${path}`, {
      ...init,
      headers: {
        'content-type': 'application/json',
        ...(init?.headers || {}),
      },
    })
    if (!res.ok) {
      const text = await res.text().catch(() => '')
      throw new Error(text || `HTTP ${res.status}`)
    }
    return (await res.json()) as T
  }

  return {
    search(query: string, lang: 'kk' | 'ru' = 'kk') {
      return apiFetch<SearchResponse>('/api/search', {
        method: 'POST',
        body: JSON.stringify({ query, lang }),
      })
    },
    whatsappPreview(offerId: string, query: string, lang: 'kk' | 'ru' = 'kk') {
      return apiFetch<WhatsAppPreviewResponse>('/api/whatsapp-preview', {
        method: 'POST',
        body: JSON.stringify({ offerId, query, lang }),
      })
    },
    shopCabinet(shopId = 'shop-gul-almaty') {
      return apiFetch<ShopCabinet>(`/api/shop/${shopId}`)
    },
  }
}
