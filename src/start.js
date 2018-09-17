const Backend = require('./api/structures/Server');
const express = require('express');
const compression = require('compression');
const ream = require('ream');
const config = require('../config');
const path = require('path');
const log = require('./api/utils/Log');
const dev = process.env.NODE_ENV !== 'production';
const oneliner = require('one-liner');
const jetpack = require('fs-jetpack');

function startProduction() {
	startAPI();
	startSite();
}

function startAPI() {
	new Backend().start();
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
else if (args === 'site') startSite();
else process.exit(0);
