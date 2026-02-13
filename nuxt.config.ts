export default defineNuxtConfig({
  compatibilityDate: '2024-12-20',
  modules: ['@nuxtjs/tailwindcss'],
  srcDir: 'app/',
  devtools: { enabled: true },
  runtimeConfig: {
    sqlitePath: './data/researcher.sqlite',
    public: {},
  },
  typescript: {
    strict: true,
    typeCheck: true,
  },
})
