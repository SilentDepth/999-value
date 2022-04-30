import { defineNuxtConfig } from 'nuxt'

// https://v3.nuxtjs.org/api/configuration/nuxt.config
export default defineNuxtConfig({
  app: {
    head: {
      htmlAttrs: {
        lang: 'zh',
        class: 'dark',
      },
      title: '999’s Value',
      link: [
        { rel: 'icon', type: 'image/png', href: '/favicon.png', size: '120x120' },
        { rel: 'stylesheet', href: 'https://rsms.me/inter/inter.css' },
      ],
    },
  },
  css: [
    '@unocss/reset/tailwind.css',
  ],
  experimental: {
    reactivityTransform: true,
  },
  modules: [
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
