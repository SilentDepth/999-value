import { transformerVariantGroup } from 'unocss'
import presetWind from 'unocss/preset-wind'

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
	devtools: { enabled: false },
	experimental: {
		componentIslands: true,
	},
	future: {
		compatibilityVersion: 4,
	},
	modules: ['@unocss/nuxt', '@nuxt/fonts'],
	unocss: {
		presets: [presetWind({ dark: 'media' })],
		transformers: [transformerVariantGroup()],
		theme: {
			fontFamily: {
				sans: 'Inter var, Inter, system-ui, sans-serif',
				display: 'Gloock, serif',
			},
		},
	},
	fonts: {
		families: [
			{
				name: 'Gloock',
				provider: 'google',
			},
		],
	},
	app: {
		head: {
			htmlAttrs: {
				lang: 'zh',
			},
			title: '999’s Value',
			link: [{ rel: 'stylesheet', href: 'https://rsms.me/inter/inter.css' }],
		},
	},
	css: ['@unocss/reset/tailwind-compat.css'],
	typescript: {
		tsConfig: {
			compilerOptions: {
				paths: {
					'server/*': ['../server/*'],
				},
			},
		},
	},
})
