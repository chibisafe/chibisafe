import { NuxtConfig } from '@nuxt/types';
import { getConfig } from '../utils/Util';
import autoprefixer from 'autoprefixer';

export default async () => {
	const settings = await getConfig();
	const config: NuxtConfig = {
		ssr: true,
		srcDir: 'src/site/',
		head: {
			title: settings.serviceName,
			titleTemplate: `%s | ${settings.serviceName}`,
			// TODO: Add the directory with pictures for favicon and stuff
			meta: [
				{ charset: 'utf-8' },
				{ name: 'viewport', content: 'width=device-width, initial-scale=1' },
				{ hid: 'theme-color', name: 'theme-color', content: `${settings.metaThemeColor}` },
				{ hid: 'description', name: 'description', content: `${settings.metaDescription}` },
				{ hid: 'keywords', name: 'keywords', content: `${settings.metaKeywords}` },
				{
					hid: 'apple-mobile-web-app-title',
					name: 'apple-mobile-web-app-title',
					content: `${settings.serviceName}`
				},
				{ hid: 'application-name', name: 'application-name', content: `${settings.serviceName}` },
				{ hid: 'twitter:card', name: 'twitter:card', content: 'summary' },
				{ hid: 'twitter:site', name: 'twitter:site', content: `${settings.metaTwitterHandle}` },
				{ hid: 'twitter:creator', name: 'twitter:creator', content: `${settings.metaTwitterHandle}` },
				{ hid: 'twitter:title', name: 'twitter:title', content: `${settings.serviceName}` },
				{ hid: 'twitter:description', name: 'twitter:description', content: `${settings.metaDescription}` },
				{ hid: 'twitter:image', name: 'twitter:image', content: `/logo.png` },
				{ hid: 'og:url', property: 'og:url', content: `/` },
				{ hid: 'og:type', property: 'og:type', content: 'website' },
				{ hid: 'og:title', property: 'og:title', content: `${settings.serviceName}` },
				{ hid: 'og:description', property: 'og:description', content: `${settings.metaDescription}` },
				{ hid: 'og:image', property: 'og:image', content: `/logo.png` },
				{ hid: 'og:image:secure_url', property: 'og:image:secure_url', content: `/logo.png` },
				{ hid: 'og:site_name', property: 'og:site_name', content: `${settings.serviceName}` }
			],
			link: [
				{ rel: 'stylesheet', href: 'https://fonts.googleapis.com/css?family=Nunito:300,400,600,700' },

				// This one is a pain in the ass to make it customizable, so you should edit it manually
				// @ts-ignore
				{ type: 'application/json+oembed', href: `/oembed.json` }
			]
		},
		plugins: [
			'~/plugins/axios',
			'~/plugins/buefy',
			'~/plugins/v-clipboard',
			'~/plugins/vue-isyourpasswordsafe',
			'~/plugins/vue-timeago',
			'~/plugins/vuebar',
			'~/plugins/notifier',
			'~/plugins/handler'
		],
		css: [],
		modules: ['@nuxtjs/axios', 'cookie-universal-nuxt'],
		router: {
			linkActiveClass: 'is-active',
			linkExactActiveClass: 'is-active'
		},
		env: {
			development: Boolean(process.env.NODE_ENV !== 'production').toString()
		},
		axios: {
			baseURL: `${process.env.NODE_ENV === 'production' ? process.env.DOMAIN as string : 'http://localhost:5000'}/api`
		},
		build: {
			extractCSS: process.env.NODE_ENV === 'production',
			// @ts-ignore
			postcss: {
				preset: {
					autoprefixer
				}
			},
			extend(config, { isDev }) {
				// Extend only webpack config for client-bundle
				if (isDev) {
					config.devtool = 'source-map';
				}
			}
		}
	};
	return config;
};
