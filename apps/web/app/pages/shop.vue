<script setup lang="ts">
const { shopCabinet } = useApi()
const loading = ref(true)
const error = ref('')
const cabinet = ref<Awaited<ReturnType<typeof shopCabinet>> | null>(null)
const whatsappEdit = ref('')

onMounted(async () => {
  try {
    cabinet.value = await shopCabinet('shop-gul-almaty')
    whatsappEdit.value = cabinet.value.shop.whatsapp
  } catch (e) {
    error.value = e instanceof Error ? e.message : 'Қате'
  } finally {
    loading.value = false
  }
})

function formatPrice(n: number) {
  return `${n.toLocaleString('ru-KZ')} ₸`
}
</script>

<template>
  <main class="app-shell">
    <div class="topbar">
      <NuxtLink class="back" to="/">← AI Іздеу</NuxtLink>
      <span class="eyebrow">Cabinet</span>
    </div>

    <h1 class="brand" style="font-size:1.6rem">Дүкен кабинеті</h1>
    <p class="lead">
      Каталог пен WhatsApp нөмірі. Тапсырысты қабылдау / төлем / курьер — MVP-де жоқ.
    </p>

    <p v-if="loading" class="hint">Жүктелуде…</p>
    <p v-if="error" class="error">{{ error }}</p>

    <template v-if="cabinet">
      <div class="card-soft stack">
        <div class="offer-title">{{ cabinet.shop.nameKk }} · {{ cabinet.shop.name }}</div>
        <div class="hint">{{ cabinet.shop.address }}</div>
        <label class="stack">
          <span class="eyebrow">WhatsApp</span>
          <input v-model="whatsappEdit" class="field" type="tel" />
        </label>
        <p class="hint">Сақтау stub — демо ғана</p>
      </div>

      <h2 class="eyebrow" style="margin-top:8px">Өнімдер / Товары</h2>
      <ul class="offer-list">
        <li v-for="p in cabinet.products" :key="p.id" class="offer-row">
          <div class="offer-meta">
            <div>
              <div class="offer-title" style="font-size:1rem">{{ p.title }}</div>
              <div class="hint">{{ p.titleRu }}</div>
            </div>
            <div class="offer-price">{{ formatPrice(p.priceKzt) }}</div>
          </div>
        </li>
      </ul>
    </template>
  </main>
</template>
