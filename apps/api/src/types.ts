export type Shop = {
  id: string
  name: string
  nameKk: string
  city: string
  address: string
  whatsapp: string
  category: string
}

export type Product = {
  id: string
  shopId: string
  title: string
  titleRu: string
  category: string
  city: string
  priceKzt: number | null
  occasion: string[]
  tags: string[]
}

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

export type SearchIntent = {
  productType: string | null
  color: string | null
  budgetMax: number | null
  occasion: string | null
  city: string
  rawQuery: string
}
