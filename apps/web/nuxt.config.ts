export default defineNuxtConfig({
  compatibilityDate: '2025-03-01',
  srcDir: 'app',
  ssr: false,
  css: ['~/assets/css/main.css'],
  app: {
    head: {
      title: 'AI Іздеу',
      htmlAttrs: { lang: 'kk' },
      meta: [
        { name: 'viewport', content: 'width=device-width, initial-scale=1, viewport-fit=cover' },
        {
          name: 'description',
          content: 'Алматы гүлдерін іздеу · WhatsApp арқылы байланыс',
        },
      ],
      link: [
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
        {
          rel: 'stylesheet',
          href: 'https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&display=swap',
        },
      ],
    },
  },
  runtimeConfig: {
    public: {
      apiBase: process.env.NUXT_PUBLIC_API_BASE || 'http://localhost:3001',
    },
  },
})
