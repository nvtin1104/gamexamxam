// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },
  modules: ['@nuxtjs/tailwindcss'],
  css: ["~/app.css"],
  tailwindcss: {
    exposeConfig: true,
    viewer: true,
  },
  
})