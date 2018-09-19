const Backend = require('./api/structures/Server');
const express = require('express');
const compression = require('compression');
// const ream = require('ream');
const config = require('../config');
const path = require('path');
const log = require('./api/utils/Log');
const dev = process.env.NODE_ENV !== 'production';
const oneliner = require('one-liner');
const jetpack = require('fs-jetpack');
// const { Nuxt, Builder } = require('nuxt-edge');
// const nuxtConfig = require('./nuxt/nuxt.config.js');

function startProduction() {
	startAPI();
	// startSite();
	// startNuxt();
}

function startAPI() {
	writeFrontendConfig();
	new Backend().start();
}

async function startNuxt() {
	/*
		Make sure the frontend has enough data to prepare the service
	*/
	writeFrontendConfig();

	/*
		Starting Nuxt's custom server powered by express
	*/

	const app = express();

	/*
		Instantiate Nuxt.js
	*/
	nuxtConfig.dev = true;
	const nuxt = new Nuxt(nuxtConfig);

	/*
		Start the server or build it if we're on dev mode
	*/

	if (nuxtConfig.dev) {
		try {
			await new Builder(nuxt).build();
		} catch (error) {
			log.error(error);
			process.exit(1);
		}
	}

	/*
		Render every route with Nuxt.js
	*/
	app.use(nuxt.render);

	/*
		Start the server and listen to the configured port
	*/
	app.listen(config.server.ports.frontend, '127.0.0.1');
	log.info(`> Frontend ready and listening on port ${config.server.ports.frontend}`);

	/*
		Starting Nuxt's custom server powered by express
	*/
	/*
	const app = express();
	app.set('port', config.server.ports.frontend);

	// Configure dev enviroment
	nuxtConfig.dev = dev;

	// Init Nuxt.js
	const nuxt = new Nuxt(nuxtConfig);

	// Build only in dev mode
	if (nuxtConfig.dev) {
		const builder = new Builder(nuxt);
		await builder.build();
	}

	// Give nuxt middleware to express
	app.use(nuxt.render);

	if (config.serveFilesWithNode) {
		app.use('/', express.static(`./${config.uploads.uploadFolder}`));
	}

	// Listen the server
	app.listen(config.server.ports.frontend, '127.0.0.1');
	app.on('renderer-ready', () => log.info(`> Frontend ready and listening on port ${config.server.ports.frontend}`));
	// log.success(`> Frontend ready and listening on port ${config.server.ports.frontend}`);
	// console.log(`Server listening on http://${host}:${port}`); // eslint-disable-line no-console
	*/
}

function startSite() {
	/*
		Make sure the frontend has enough data to prepare the service
	*/
	writeFrontendConfig();

	/*
		Starting ream's custom server
	*/
	const server = express();
	const app = ream({
		dev,
		entry: path.join(__dirname, 'site', 'index.js')
	});

	app.getRequestHandler().then(handler => {
		server.use(compression());
		/*
			This option is mostly for development, since serving the files with nginx is better.
		*/
		if (config.serveFilesWithNode) {
			server.use('/', express.static(`./${config.uploads.uploadFolder}`));
		}
		server.get('*', handler);
		server.listen(config.server.ports.frontend, error => {
			if (error) log.error(error);
		});
	});

	app.on('renderer-ready', () => log.info(`> Frontend ready and listening on port ${config.server.ports.frontend}`));
}

function writeFrontendConfig() {
	/*
		Since ream can't execute getInitialData on non-routes we write a config file for it.
	*/
	const template = oneliner`
		module.exports = {
			version: '${process.env.npm_package_version}',
			URL: '${config.filesServeLocation}',
			baseURL: '${config.backendLocation}',
			serviceName: '${config.serviceName}',
			maxFileSize: '${config.uploads.uploadMaxSize}',
			chunkSize: '${config.uploads.chunkSize}',
			maxLinksPerAlbum: '${config.albums.maxLinksPerAlbum}'
		}`;
	jetpack.write(path.join(__dirname, 'site', 'config.js'), template);
	log.success('Frontend config file generated successfully');
}

/*
	Having multiple files for different scripts was mendokusai.
*/
const args = process.argv[2];
if (!args) startProduction();
else if (args === 'api') startAPI();
else if (args === 'site') startNuxt();
else process.exit(0);
