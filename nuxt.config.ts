// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  css: ['~/assets/css/main.css'],
  // API-Routen liegen unter app/server/, nicht im Root server/
  serverDir: 'app/server',
  runtimeConfig: {
    voyageKey: '',
    claudeKey: '',
    supabaseUrl: '',
    supabaseKey: '',
  }
})
