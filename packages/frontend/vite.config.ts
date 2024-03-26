import { readFileSync } from 'node:fs';
import { resolve, join } from 'node:path';
import vue from '@vitejs/plugin-vue';
import * as dotenv from 'dotenv';
import { defineConfig } from 'vite';
import { createHtmlPlugin } from 'vite-plugin-html';
import Pages from 'vite-plugin-pages';

// Since we're using the same .env file for both the frontend and backend, we need to specify the path
dotenv.config({
	path: join(__dirname, '..', '.env')
});

// https://lucide.dev/icons/list

const backendUrl = 'http://127.0.0.1:8000';

export default defineConfig({
	resolve: {
		alias: {
			'~/': `${resolve(__dirname, 'src')}/`,
			'@/': `${resolve(__dirname, 'src')}/`
		}
	},
	define: {
		PACKAGE_VERSION: JSON.stringify(JSON.parse(readFileSync('../../package.json', 'utf8')).version)
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
		createHtmlPlugin({
			minify: true,
			entry: '/src/main.ts',
			template: 'src/index.html'
		})
	],
	optimizeDeps: {
		include: ['vue', 'vue-router', '@vueuse/core'],
		exclude: ['vue-demi']
	},
	server: {
		port: 8002,
		proxy: {
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
