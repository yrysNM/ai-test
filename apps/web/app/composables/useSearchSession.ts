import type { Offer } from './useApi'

const query = ref('')
const lang = ref<'kk' | 'ru'>('kk')
const offers = ref<Offer[]>([])
const selectedOfferId = ref<string | null>(null)
const provider = ref<'ollama' | 'heuristic' | null>(null)

export function useSearchSession() {
  function setResults(payload: {
    query: string
    lang: 'kk' | 'ru'
    offers: Offer[]
    provider: 'ollama' | 'heuristic'
  }) {
    query.value = payload.query
    lang.value = payload.lang
    offers.value = payload.offers
    provider.value = payload.provider
  }

  function selectOffer(offerId: string) {
    selectedOfferId.value = offerId
  }

  const selectedOffer = computed(() =>
    offers.value.find((o) => o.offerId === selectedOfferId.value) ?? null,
  )

  return reactive({
    query,
    lang,
    offers,
    provider,
    selectedOfferId,
    selectedOffer,
    setResults,
    selectOffer,
  })
}
