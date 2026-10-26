<script setup lang="ts">
const query = ref('Анама қызғылт раушан, 15000 теңгеге дейін')
const lang = ref<'kk' | 'ru'>('kk')
const loading = ref(false)
const error = ref('')
const { search } = useApi()
const session = useSearchSession()

async function onSearch() {
  error.value = ''
  const q = query.value.trim()
  if (!q) {
    error.value = lang.value === 'kk' ? 'Сұрау енгізіңіз' : 'Введите запрос'
    return
  }
  loading.value = true
  try {
    const res = await search(q, lang.value)
    session.setResults({
      query: res.query,
      lang: res.lang,
      offers: res.offers,
      provider: res.provider,
    })
    await navigateTo('/results')
  } catch (e) {
    error.value = e instanceof Error ? e.message : 'Іздеу қатесі'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <main class="app-shell">
    <div class="topbar">
      <span class="eyebrow">Алматы · Гүлдер</span>
      <div style="display:flex;gap:8px">
        <button class="btn btn-secondary" style="padding:8px 12px;font-size:0.8rem" type="button" @click="lang = 'kk'">
          KK
        </button>
        <button class="btn btn-secondary" style="padding:8px 12px;font-size:0.8rem" type="button" @click="lang = 'ru'">
          RU
        </button>
      </div>
    </div>

    <h1 class="brand brand--hero">AI Іздеу</h1>
    <p class="lead">
      <template v-if="lang === 'kk'">
        Қалаған гүлді сөйлеммен сипаттаңыз — дүкенге WhatsApp арқылы жазыңыз. Төлем сайтта жоқ.
      </template>
      <template v-else>
        Опишите букет своими словами — напишите магазину в WhatsApp. Оплаты на сайте нет.
      </template>
    </p>

    <form class="search-block" @submit.prevent="onSearch">
      <textarea
        v-model="query"
        class="message-box"
        rows="3"
        :placeholder="lang === 'kk' ? 'Мысалы: анама қызғылт раушан…' : 'Например: маме розовые розы…'"
      />
      <button class="btn btn-primary" type="submit" :disabled="loading">
        {{ loading ? (lang === 'kk' ? 'Ізделуде…' : 'Ищем…') : lang === 'kk' ? 'Іздеу' : 'Найти' }}
      </button>
      <p v-if="error" class="error">{{ error }}</p>
      <p class="hint">WhatsApp-қа өту · без оплаты на сайте</p>
    </form>

    <NuxtLink class="hint" to="/shop" style="margin-top:auto;font-weight:700">
      {{ lang === 'kk' ? 'Дүкен кабинеті →' : 'Кабинет магазина →' }}
    </NuxtLink>
  </main>
</template>
