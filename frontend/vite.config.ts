// eslint-disable-next-line spaced-comment, @typescript-eslint/triple-slash-reference
/// <reference types="unplugin-icons/types/vue3" />

import * as dotenv from 'dotenv';
import { readFileSync } from 'node:fs';
import { resolve, join } from 'node:path';
import vue from '@vitejs/plugin-vue';
import IconsResolver from 'unplugin-icons/resolver';
import Icons from 'unplugin-icons/vite';
import Components from 'unplugin-vue-components/vite';
import { defineConfig, loadEnv } from 'vite';
import Pages from 'vite-plugin-pages';
import { createHtmlPlugin } from 'vite-plugin-html';
import process from 'node:process';

// Since we're using the same .env file for both the frontend and backend, we need to specify the path
dotenv.config({
	path: join(__dirname, '..', '.env')
});

// https://icon-sets.iconify.design/carbon

// TODO: Revisit when implementing docker

// eslint-disable-next-line no-restricted-globals, n/prefer-global/process
const backendUrl = process.env.ENV === 'docker' ? '/api/' : 'http://127.0.0.1:8000';

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
		vue({
			template: {
				compilerOptions: {
					isCustomElement: tag => tag.startsWith('media-')
				}
			}
		}),
		Pages({
			dirs: [{ dir: 'src/pages', baseRoute: '' }],
			exclude: ['**/*.test.ts'],
			extendRoute: route => {
				if (route.path === '/dashboard') {
					return { ...route, redirect: '/dashboard/uploads' };
				}

				return route;
			}
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
			autoInstall: true,
			compiler: 'vue3'
		}),
		createHtmlPlugin({
			minify: true,
			entry: '/src/main.ts',
			template: 'src/index.html',
			inject: {
				data: {
					title: process.env.SERVICE_NAME,
					description: process.env.META_DESCRIPTION,
					keywords: process.env.META_KEYWORDS,
					twitter: process.env.META_TWITTER_HANDLE,
					domain: process.env.DOMAIN
				}
			}
		})
	],
	optimizeDeps: {
		include: ['vue', 'vue-router', '@vueuse/core'],
		exclude: ['vue-demi']
	},
	server: {
		port: 8001,
		proxy: {
			// TODO: Disable if running through docker or in production
			'/api': {
				target: backendUrl,
				changeOrigin: true,
				secure: false
			}
		},
		watch: {
			usePolling: true
		}
	},
	envDir: './frontend',
	publicDir: './src/public'
});
