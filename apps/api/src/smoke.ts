import dotenv from 'dotenv'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

dotenv.config({ path: join(dirname(fileURLToPath(import.meta.url)), '..', '.env') })

const base = process.env.SMOKE_API_BASE || 'http://localhost:3001'

async function main() {
  const health = await fetch(`${base}/health`).then((r) => r.json())
  console.log('health', health)

  const search = await fetch(`${base}/api/search`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ query: 'Анама қызғылт раушан, 15000 теңгеге дейін', lang: 'kk' }),
  }).then((r) => r.json()) as {
    provider: string
    offers: Array<{ offerId: string; title: string; priceKzt: number }>
    intent: unknown
  }

  console.log('search provider', search.provider)
  console.log('intent', search.intent)
  console.log(
    'offers',
    search.offers.map((o) => ({ id: o.offerId, title: o.title, price: o.priceKzt })),
  )

  if (!search.offers.length) {
    throw new Error('No offers returned')
  }

  const preview = await fetch(`${base}/api/whatsapp-preview`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({
      offerId: search.offers[0].offerId,
      query: 'Анама қызғылт раушан, 15000 теңгеге дейін',
      lang: 'kk',
    }),
  }).then((r) => r.json()) as { waUrl: string; message: string }

  console.log('waUrl starts with wa.me', preview.waUrl.startsWith('https://wa.me/'))
  console.log('message preview:', preview.message.slice(0, 160).replace(/\n/g, ' | '))
  console.log('SMOKE OK')
}

main().catch((err) => {
  console.error('SMOKE FAILED', err)
  process.exit(1)
})
