import autoprefixer from 'autoprefixer';
import serveStatic from 'serve-static';
import path from 'path';
import config from './config';

export default {
	server: {
		port: config.server.ports.frontend
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
