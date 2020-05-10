import dotenv from 'dotenv/config';
import autoprefixer from 'autoprefixer';
import jetpack from 'fs-jetpack';

const clientConfig = {
	development: process.env.NODE_ENV !== 'production',
	version: process.env.npm_package_version,
	URL: process.env.DOMAIN,
	baseURL: `${process.env.DOMAIN}${process.env.ROUTE_PREFIX}`,
	serviceName: process.env.SERVICE_NAME,
	maxFileSize: parseInt(process.env.MAX_SIZE, 10),
	chunkSize: parseInt(process.env.CHUNK_SIZE, 10),
	maxLinksPerAlbum: parseInt(process.env.MAX_LINKS_PER_ALBUM, 10),
	publicMode: process.env.PUBLIC_MODE === 'true' ? true : false,
	userAccounts: process.env.USER_ACCOUNTS === 'true' ? true : false
};

export default {
	mode: 'spa',
	server: {
		port: process.env.WEBSITE_PORT
	},
	srcDir: 'src/site/',
	head: {
		title: process.env.SERVICE_NAME,
		titleTemplate: `%s | ${process.env.SERVICE_NAME}`,
		// TODO: Add the directory with pictures for favicon and stuff
		meta: [
			{ charset: 'utf-8' },
			{ name: 'viewport', content: 'width=device-width, initial-scale=1' },
			{ hid: 'theme-color', name: 'theme-color', content: `${process.env.META_THEME_COLOR}` },
			{ hid: 'description', name: 'description', content: `${process.env.META_DESCRIPTION}` },
			{ hid: 'keywords', name: 'keywords', content: `${process.env.META_KEYWORDS}` },
			{ hid: 'apple-mobile-web-app-title', name: 'apple-mobile-web-app-title', content: `${process.env.SERVICE_NAME}` },
			{ hid: 'application-name', name: 'application-name', content: `${process.env.SERVICE_NAME}` },
			// { hid: 'msapplication-config', name: 'msapplication-config', content: `${process.env.DOMAIN}/browserconfig.xml` },
			{ hid: 'twitter:card', name: 'twitter:card', content: 'summary_large_image' },
			{ hid: 'twitter:site', name: 'twitter:site', content: `${process.env.META_TWITTER_HANDLE}` },
			{ hid: 'twitter:creator', name: 'twitter:creator', content: `${process.env.META_TWITTER_HANDLE}` },
			{ hid: 'twitter:title', name: 'twitter:title', content: `${process.env.SERVICE_NAME}` },
			{ hid: 'twitter:description', name: 'twitter:description', content: `${process.env.META_DESCRIPTION}` },
			{ hid: 'twitter:image', name: 'twitter:image', content: `${process.env.DOMAIN}/share.jpg` },
			{ hid: 'og:url', property: 'og:url', content: `${process.env.DOMAIN}` },
			{ hid: 'og:type', property: 'og:type', content: 'website' },
			{ hid: 'og:title', property: 'og:title', content: `${process.env.SERVICE_NAME}` },
			{ hid: 'og:description', property: 'og:description', content: `${process.env.META_DESCRIPTION}` },
			{ hid: 'og:image', property: 'og:image', content: `${process.env.DOMAIN}/share.jpg` },
			{ hid: 'og:image:secure_url', property: 'og:image:secure_url', content: `${process.env.DOMAIN}/share.jpg` },
			{ hid: 'og:site_name', property: 'og:site_name', content: `${process.env.SERVICE_NAME}` }
		],
		link: [
			{ rel: 'stylesheet', href: 'https://fonts.googleapis.com/css?family=Nunito:300,400,600,700' },

			// This one is a pain in the ass to make it customizable, so you should edit it manually
			{ type: 'application/json+oembed', href: `${process.env.DOMAIN}/oembed.json` }
		]
	},
	plugins: [
		'~/plugins/axios',
		'~/plugins/buefy',
		'~/plugins/v-clipboard',
		'~/plugins/vue-isyourpasswordsafe',
		'~/plugins/vue-timeago',
		'~/plugins/flexsearch',
		'~/plugins/vuebar',
		'~/plugins/nuxt-client-init'
	],
	css: [],
	modules: [
		'@nuxtjs/axios',
		'cookie-universal-nuxt'
	],
	axios: {
		baseURL: `${process.env.DOMAIN}${process.env.ROUTE_PREFIX}`
	},
	build: {
		extractCSS: true,
		postcss: {
			preset: {
				autoprefixer
			}
		},
		extend(config, { isClient }) {
			// Extend only webpack config for client-bundle
			if (isClient) {
				jetpack.write('dist/config.json', clientConfig);
			}
		}
	}
};
