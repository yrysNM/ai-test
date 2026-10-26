<script setup lang="ts">
const session = useSearchSession()
const { whatsappPreview } = useApi()

const message = ref('')
const waUrl = ref('')
const loading = ref(false)
const error = ref('')
const copied = ref(false)

onMounted(async () => {
  if (!session.selectedOffer || !session.query) {
    await navigateTo(session.offers.length ? '/results' : '/')
    return
  }
  await loadDraft()
})

async function loadDraft() {
  const offer = session.selectedOffer
  if (!offer) return
  loading.value = true
  error.value = ''
  try {
    const res = await whatsappPreview(offer.offerId, session.query, session.lang)
    message.value = res.message
    waUrl.value = res.waUrl
  } catch (e) {
    error.value = e instanceof Error ? e.message : 'Қате'
  } finally {
    loading.value = false
  }
}

function rebuildWaUrl() {
  const offer = session.selectedOffer
  if (!offer) return
  waUrl.value = `https://wa.me/${offer.whatsapp}?text=${encodeURIComponent(message.value)}`
}

watch(message, rebuildWaUrl)

async function copyMessage() {
  try {
    await navigator.clipboard.writeText(message.value)
    copied.value = true
    setTimeout(() => {
      copied.value = false
    }, 1500)
  } catch {
    error.value = 'Copy failed'
  }
}

function formatPrice(n: number) {
  return `${n.toLocaleString('ru-KZ')} ₸`
}
</script>

<template>
  <main class="app-shell">
    <div class="topbar">
      <NuxtLink class="back" to="/results">← {{ session.lang === 'kk' ? 'Нәтижелер' : 'Результаты' }}</NuxtLink>
      <span class="eyebrow">WhatsApp</span>
    </div>

    <h1 class="brand" style="font-size:1.55rem">
      {{ session.lang === 'kk' ? 'Хабарлама' : 'Сообщение' }}
    </h1>

    <div v-if="session.selectedOffer" class="card-soft stack">
      <div class="eyebrow">{{ session.selectedOffer.shopName }}</div>
      <div class="offer-title">
        {{
          session.lang === 'kk'
            ? session.selectedOffer.title
            : session.selectedOffer.titleRu
        }}
      </div>
      <div class="offer-price">{{ formatPrice(session.selectedOffer.priceKzt) }}</div>
      <p class="hint">Комиссия / 500 ₸ — жоқ · нет</p>
    </div>

    <label class="stack">
      <span class="eyebrow">{{ session.lang === 'kk' ? 'Мәтін' : 'Текст' }}</span>
      <textarea v-model="message" class="message-box" :disabled="loading" />
    </label>

    <p v-if="error" class="error">{{ error }}</p>
    <p v-if="loading" class="hint">{{ session.lang === 'kk' ? 'Жазылуда…' : 'Черновик…' }}</p>

    <div class="actions">
      <a
        class="btn btn-primary btn-pulse"
        :href="waUrl || '#'"
        target="_blank"
        rel="noopener noreferrer"
        :aria-disabled="!waUrl"
        @click="!waUrl && $event.preventDefault()"
      >
        {{ session.lang === 'kk' ? 'WhatsApp-қа жіберу' : 'Открыть WhatsApp' }}
      </a>
      <button class="btn btn-secondary" type="button" @click="copyMessage">
        {{ copied ? '✓' : session.lang === 'kk' ? 'Көшіру' : 'Скопировать' }}
      </button>
    </div>
  </main>
</template>
