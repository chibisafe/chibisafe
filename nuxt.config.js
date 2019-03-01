import dotenv from 'dotenv/config';
import autoprefixer from 'autoprefixer';
import serveStatic from 'serve-static';
import path from 'path';

export default {
	server: {
		port: process.env.WEBSITE_PORT
	},
	env: {
		version: process.env.npm_package_version,
		URL: process.env.DOMAIN,
		baseURL: `${process.env.DOMAIN}${process.env.ROUTE_PREFIX}`,
		serviceName: process.env.SERVICE_NAME,
		maxFileSize: process.env.MAX_SIZE,
		chunkSize: process.env.CHUNK_SIZE,
		maxLinksPerAlbum: process.env.MAX_LINKS_PER_ALBUM,
		publicMode: process.env.PUBLIC_MODE,
		userAccounts: process.env.USER_ACCOUNTS
	},
	srcDir: 'src/site/',
	head: {
		meta: [
			{ charset: 'utf-8' },
			{ name: 'viewport', content: 'width=device-width, initial-scale=1' }
		],
		link: [
			{ rel: 'stylesheet', href: 'https://fonts.googleapis.com/css?family=Nunito:300,400,600,700' }
		]
	},
	plugins: [
		'~/plugins/vue-axios',
		'~/plugins/buefy',
		'~/plugins/v-clipboard',
		'~/plugins/vue-analytics',
		'~/plugins/vue-isyourpasswordsafe',
		'~/plugins/vue-timeago'
	],
	serverMiddleware: [
		{ path: '/', handler: serveStatic(path.join(__dirname, 'uploads')) }
	],
	css: [],
	build: {
		extractCSS: true,
		postcss: [
			autoprefixer
		]
	}
};
