const Backend = require('./api/structures/Server');
const express = require('express');
const compression = require('compression');
const ream = require('ream');
const config = require('../config');
const path = require('path');
const log = require('./api/utils/Log');
const dev = process.env.NODE_ENV !== 'production';
// const reamConfig = require('../../ream.config');

function startProduction() {
	startAPI();
	startSite();
}

function startAPI() {
	new Backend().start();
	// const backend = new Backend().start();
	// backend.start();
}

function startSite() {
	// console.log(reamConfig);
	// console.log();
	const server = express();
	const app = ream({
		// The path join below prints X:\lolisafe2.2\src\site\index.js which is correct
		entry: path.join(__dirname, 'site', 'index.js'),
		html: path.join(__dirname, 'site', 'index.html'),
		// entry: './site/index.js',
		// html: './site/index.html',
		dev
	});

	// console.log(app);

	app.getRequestHandler().then(handler => {
		server.use(compression());
		/*
			JUST TEMPORARY FOR LOCAL DEVELOPMENT, LETS SERVE THE UPLOADS FOLDER
		*/
		/*
		if (config.serveFilesWithNode) {
			server.use('/', express.static(`./${config.uploads.uploadFolder}`));
		}
		*/
		server.get('*', handler);
		server.listen(config.server.ports.frontend, error => {
			if (error) log.error(error);
		});
	});

	app.on('renderer-ready', () => log.info(`> Frontend ready and listening on port ${config.server.ports.frontend}`));
}

const args = process.argv[2];
if (!args) startProduction();
else if (args === 'api') startAPI();
else if (args === 'site') startSite();
else process.exit(0);
