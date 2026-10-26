<script setup lang="ts">
const session = useSearchSession()
const router = useRouter()

onMounted(() => {
  if (!session.query) {
    navigateTo('/')
  }
})

function openPreview(offerId: string) {
  session.selectOffer(offerId)
  router.push('/preview')
}

function formatPrice(n: number) {
  return `${n.toLocaleString('ru-KZ')} ₸`
}
</script>

<template>
  <main class="app-shell">
    <div class="topbar">
      <NuxtLink class="back" to="/">← {{ session.lang === 'kk' ? 'Артқа' : 'Назад' }}</NuxtLink>
      <span class="eyebrow">{{ session.lang === 'kk' ? 'Нәтижелер' : 'Результаты' }}</span>
    </div>

    <h1 class="brand" style="font-size:1.6rem">
      {{ session.lang === 'kk' ? 'Ұсыныстар' : 'Предложения' }}
    </h1>

    <div v-if="session.query" class="chip">{{ session.query }}</div>
    <p v-if="session.provider" class="hint">
      AI: {{ session.provider }}
      ·
      {{ session.lang === 'kk' ? 'Бағасы жоқ ұсыныстар көрсетілмейді' : 'Предложения без цены скрыты' }}
    </p>

    <ul v-if="session.offers.length" class="offer-list">
      <li v-for="o in session.offers" :key="o.offerId" class="offer-row">
        <div class="offer-meta">
          <div>
            <div class="eyebrow">{{ o.shopName }}</div>
            <div class="offer-title">
              {{ session.lang === 'kk' ? o.title : o.titleRu }}
            </div>
          </div>
          <div class="offer-price">{{ formatPrice(o.priceKzt) }}</div>
        </div>
        <div class="offer-reason">{{ o.matchReason }}</div>
        <div class="actions" style="margin-top:8px">
          <button class="btn btn-primary" type="button" @click="openPreview(o.offerId)">
            WhatsApp
          </button>
        </div>
      </li>
    </ul>

    <div v-else class="card-soft">
      <p>
        {{
          session.lang === 'kk'
            ? 'Сәйкес ұсыныс табылмады. Басқа сөзбен көріңіз.'
            : 'Подходящих предложений нет. Попробуйте другой запрос.'
        }}
      </p>
      <NuxtLink class="btn btn-secondary" to="/" style="margin-top:12px;display:inline-flex">
        {{ session.lang === 'kk' ? 'Қайта іздеу' : 'Искать снова' }}
      </NuxtLink>
    </div>
  </main>
</template>
