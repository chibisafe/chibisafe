import dotenv from 'dotenv/config';
import autoprefixer from 'autoprefixer';

const Util = require('./src/api/utils/Util');

export default async () => {
	/*
		FIXME:
		Since Util.config is not populated during production env because it needs to grab the values from the db
		we need to use this hack to populate it before we can access the properties without await like we do in the export below.
		This will be solved once the TypeScript rewrite is complete as we can can simply pass a config object to express
		and build from there, but for now the build needs to be triggered before the API is started.
	*/
	await Util.config;
	return {
		ssr: true,
		srcDir: 'src/site/',
		head: {
			title: Util.config.serviceName,
			titleTemplate: `%s | ${Util.config.serviceName}`,
			// TODO: Add the directory with pictures for favicon and stuff
			meta: [
				{ charset: 'utf-8' },
				{ name: 'viewport', content: 'width=device-width, initial-scale=1' },
				{ hid: 'theme-color', name: 'theme-color', content: `${Util.config.metaThemeColor}` },
				{ hid: 'description', name: 'description', content: `${Util.config.metaDescription}` },
				{ hid: 'keywords', name: 'keywords', content: `${Util.config.metaKeywords}` },
				{
					hid: 'apple-mobile-web-app-title',
					name: 'apple-mobile-web-app-title',
					content: `${Util.config.serviceName}`
				},
				{ hid: 'application-name', name: 'application-name', content: `${Util.config.serviceName}` },
				{ hid: 'twitter:card', name: 'twitter:card', content: 'summary' },
				{ hid: 'twitter:site', name: 'twitter:site', content: `${Util.config.metaTwitterHandle}` },
				{ hid: 'twitter:creator', name: 'twitter:creator', content: `${Util.config.metaTwitterHandle}` },
				{ hid: 'twitter:title', name: 'twitter:title', content: `${Util.config.serviceName}` },
				{ hid: 'twitter:description', name: 'twitter:description', content: `${Util.config.metaDescription}` },
				{ hid: 'twitter:image', name: 'twitter:image', content: `/logo.png` },
				{ hid: 'og:url', property: 'og:url', content: `/` },
				{ hid: 'og:type', property: 'og:type', content: 'website' },
				{ hid: 'og:title', property: 'og:title', content: `${Util.config.serviceName}` },
				{ hid: 'og:description', property: 'og:description', content: `${Util.config.metaDescription}` },
				{ hid: 'og:image', property: 'og:image', content: `/logo.png` },
				{ hid: 'og:image:secure_url', property: 'og:image:secure_url', content: `/logo.png` },
				{ hid: 'og:site_name', property: 'og:site_name', content: `${Util.config.serviceName}` }
			],
			link: [
				{ rel: 'stylesheet', href: 'https://fonts.googleapis.com/css?family=Nunito:300,400,600,700' },

				// This one is a pain in the ass to make it customizable, so you should edit it manually
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
			development: process.env.NODE_ENV !== 'production'
		},
		axios: {
			baseURL: `${process.env.NODE_ENV === 'production' ? process.env.DOMAIN : 'http://localhost:5000'}/api`
		},
		build: {
			extractCSS: process.env.NODE_ENV === 'production',
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
};
