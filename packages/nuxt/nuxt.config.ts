// https://nuxt.com/docs/api/configuration/nuxt-config
import process from 'node:process';

export default defineNuxtConfig({
	srcDir: './src/',
	runtimeConfig: {
		public: {
			productionMode: process.env.NODE_ENV === 'production'
		}
	},
	colorMode: {
		classSuffix: '',
		preference: 'dark'
	},
	devtools: {
		enabled: true,
		timeline: {
			enabled: true
		}
	},
	experimental: {
		inlineSSRStyles: false
	},
	googleFonts: {
		display: 'swap',
		families: {
			Nunito: [400, 700]
		},
		// [a-z] + [A-Z] + [0-9] + -'/?.:,
		text: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-%27%2F%3F.%3A%2C'
	},
	imports: {
		dirs: ['./src/stores']
	},
	modules: ['@nuxtjs/tailwindcss', '@pinia/nuxt', '@nuxtjs/color-mode', '@nuxtjs/google-fonts', '@nuxtjs/i18n'],
	pinia: {
		autoImports: ['defineStore', 'acceptHMRUpdate']
	},
	build: {
		transpile: ['vue-sonnar']
	}
});
