import { defineNuxtConfig } from 'nuxt/config'

export default defineNuxtConfig({
  devtools: true,
  experimental: {
    componentIslands: true,
  },
  app: {
    head: {
      htmlAttrs: {
        lang: 'zh',
        class: 'dark',
      },
      title: '999’s Value',
      link: [
        { rel: 'icon', type: 'image/png', href: '/favicon.png', sizes: '120x120' },
        { rel: 'stylesheet', href: 'https://rsms.me/inter/inter.css' },
      ],
    },
  },
  css: [
    '@unocss/reset/tailwind.css',
  ],
  modules: [
    '@vue-macros/nuxt',
    '@unocss/nuxt',
    '@vueuse/nuxt',
  ],
  unocss: {
    theme: {
      fontFamily: {
        sans: ['Inter var', 'Inter'],
      },
    },
  },
})
