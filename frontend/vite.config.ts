import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import vue from '@vitejs/plugin-vue';
import IconsResolver from 'unplugin-icons/resolver';
import Icons from 'unplugin-icons/vite';
import Components from 'unplugin-vue-components/vite';
import { defineConfig, loadEnv } from 'vite';
import Pages from 'vite-plugin-pages';

// https://icon-sets.iconify.design/carbon

// TODO: Revisit when implementing docker

// eslint-disable-next-line no-restricted-globals, n/prefer-global/process
const backendUrl = process.env.ENV === 'docker' ? 'http://backend:8080/' : 'http://localhost:8000/';

export default defineConfig({
	resolve: {
		alias: {
			'~/': `${resolve(__dirname, 'src')}/`
		}
	},
	define: {
		PACKAGE_VERSION: JSON.stringify(JSON.parse(readFileSync('package.json', 'utf8')).version)
	},
	plugins: [
		vue(),
		Pages({
			dirs: [{ dir: 'src/pages', baseRoute: '' }],
			exclude: ['**/*.test.ts'] // Be careful 'src/**/*.test.ts' does not work expectedly
		}),
		Components({
			dts: true,
			resolvers: [
				IconsResolver({
					componentPrefix: ''
				})
			]
		}),
		Icons({
			compiler: 'vue3'
		})
	],
	optimizeDeps: {
		include: ['vue', 'vue-router', '@vueuse/core'],
		exclude: ['vue-demi']
	},

	server: {
		port: 8_001,
		proxy: {
			'/api': {
				target: backendUrl,
				changeOrigin: true
			}
		},
		watch: {
			usePolling: true
		}
	},
	envDir: './frontend'
});
