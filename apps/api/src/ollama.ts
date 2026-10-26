import type { SearchIntent } from './types.js'

function requireEnv(name: string): string {
  const v = process.env[name]?.trim()
  if (!v) {
    throw new Error(`Missing required env ${name}`)
  }
  return v
}

export function ollamaConfig() {
  return {
    apiKey: requireEnv('OLLAMA_API_KEY'),
    host: (process.env.OLLAMA_HOST || 'https://ollama.com').replace(/\/$/, ''),
    model: process.env.OLLAMA_MODEL || 'gpt-oss:120b-cloud',
  }
}

type ChatMessage = { role: 'system' | 'user' | 'assistant'; content: string }

export async function chat(messages: ChatMessage[], opts?: { temperature?: number }): Promise<string> {
  const { apiKey, host, model } = ollamaConfig()
  const url = `${host}/api/chat`
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model,
      stream: false,
      messages,
      options: { temperature: opts?.temperature ?? 0.2 },
    }),
  })

  if (!res.ok) {
    const text = await res.text().catch(() => '')
    throw new Error(`Ollama chat failed: ${res.status} ${text.slice(0, 200)}`)
  }

  const data = (await res.json()) as {
    message?: { content?: string }
    messages?: Array<{ content?: string }>
  }
  const content = data.message?.content ?? data.messages?.at(-1)?.content
  if (!content) throw new Error('Ollama returned empty content')
  return content
}

function extractJson(text: string): unknown {
  const trimmed = text.trim()
  const fence = trimmed.match(/```(?:json)?\s*([\s\S]*?)```/i)
  const raw = fence ? fence[1].trim() : trimmed
  const start = raw.indexOf('{')
  const end = raw.lastIndexOf('}')
  if (start >= 0 && end > start) {
    return JSON.parse(raw.slice(start, end + 1))
  }
  return JSON.parse(raw)
}

export async function parseSearchIntent(query: string, lang: 'kk' | 'ru'): Promise<SearchIntent> {
  const system = `You extract flower-search intent for Almaty, Kazakhstan.
Return ONLY JSON with keys: productType (string|null), color (string|null), budgetMax (number|null, KZT), occasion (string|null), city (string, default "almaty").
Never invent a budget if the user did not mention one — use null.
Language of user query: ${lang}. Keep productType/color/occasion as short lowercase tokens useful for matching (can mix kk/ru roots).`

  const content = await chat(
    [
      { role: 'system', content: system },
      { role: 'user', content: query },
    ],
    { temperature: 0 },
  )

  try {
    const parsed = extractJson(content) as Partial<SearchIntent>
    return {
      productType: parsed.productType ?? null,
      color: parsed.color ?? null,
      budgetMax: typeof parsed.budgetMax === 'number' ? parsed.budgetMax : null,
      occasion: parsed.occasion ?? null,
      city: (parsed.city || 'almaty').toLowerCase(),
      rawQuery: query,
    }
  } catch {
    return heuristicIntent(query)
  }
}

/** Offline fallback when Ollama is unavailable */
export function heuristicIntent(query: string): SearchIntent {
  const q = query.toLowerCase()
  let budgetMax: number | null = null
  const m = q.match(/(\d[\d\s]{2,})\s*(₸|тенге|теңге|tg)?/i)
  if (m) {
    const n = Number(m[1].replace(/\s/g, ''))
    if (!Number.isNaN(n) && n > 500) budgetMax = n
  }

  let color: string | null = null
  if (/қызғылт|розов|pink/.test(q)) color = 'қызғылт'
  else if (/қызыл|красн|red/.test(q)) color = 'қызыл'
  else if (/ақ|бел|white/.test(q)) color = 'ақ'

  let productType: string | null = null
  if (/раушан|роз/.test(q)) productType = 'раушан'
  else if (/қызғалдақ|тюльпан/.test(q)) productType = 'қызғалдақ'
  else if (/пион/.test(q)) productType = 'пион'
  else if (/хризантем/.test(q)) productType = 'хризантема'
  else if (/букет|гүл|цвет/.test(q)) productType = 'букет'

  let occasion: string | null = null
  if (/ана|мам|мама/.test(q)) occasion = 'ана'
  else if (/туған|день рожден|др/.test(q)) occasion = 'туған күн'

  return {
    productType,
    color,
    budgetMax,
    occasion,
    city: 'almaty',
    rawQuery: query,
  }
}

export async function draftWhatsAppMessage(opts: {
  query: string
  lang: 'kk' | 'ru'
  shopName: string
  productTitle: string
  priceKzt: number
}): Promise<string> {
  const system = `You write a short WhatsApp message from a customer to a flower shop in Almaty.
Rules:
- Language: ${opts.lang === 'kk' ? 'Kazakh' : 'Russian'}
- Mention the product and the real price ${opts.priceKzt} ₸ — do NOT invent other prices
- Mention the user's wish from their query
- Polite, 3–6 short lines
- Do NOT mention any platform fee, commission, or 500 ₸
- Do NOT invent delivery time or address the shop didn't provide
Return ONLY the message text, no quotes or markdown.`

  const user = `Shop: ${opts.shopName}
Product: ${opts.productTitle}
Price: ${opts.priceKzt} ₸
User query: ${opts.query}`

  try {
    return (await chat(
      [
        { role: 'system', content: system },
        { role: 'user', content: user },
      ],
      { temperature: 0.4 },
    )).trim()
  } catch {
    if (opts.lang === 'kk') {
      return `Сәлем! AI Іздеу арқылы жазып тұрмын.\nҚызықтыратыны: ${opts.productTitle} (${opts.priceKzt} ₸).\nӨтініш: ${opts.query}\nБар ма және қалай алуға болады?`
    }
    return `Здравствуйте! Пишу через AI Іздеу.\nИнтересует: ${opts.productTitle} (${opts.priceKzt} ₸).\nПожелание: ${opts.query}\nЕсть в наличии и как оформить?`
  }
}
