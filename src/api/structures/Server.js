const config = require('../../../config');
const log = require('../utils/Log');
const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const RateLimit = require('express-rate-limit');
const bodyParser = require('body-parser');
const jetpack = require('fs-jetpack');
const path = require('path');
const Database = require('./Database');
const oneliner = require('one-liner');

const rateLimiter = new RateLimit({
	windowMs: config.server.rateLimits.window,
	max: config.server.rateLimits.max,
	delayMs: 0
});

class Server {
	constructor() {
		this.port = config.server.ports.backend;
		this.server = express();
		this.server.set('trust proxy', 1);
		this.server.use(helmet());
		this.server.use(cors({ allowedHeaders: ['Accept', 'Authorization', 'Cache-Control', 'X-Requested-With', 'Content-Type', 'albumId'] }));
		this.server.use((req, res, next) => {
			/*
				This bypasses the headers.accept for album download, since it's accesed directly through the browser.
			*/
			if (req.url.includes('/api/album/') && req.url.includes('/zip') && req.method === 'GET') return next();
			if (req.headers.accept === 'application/vnd.lolisafe.json') return next();
			return res.status(405).json({ message: 'Incorrect `Accept` header provided' });
		});
		this.server.use(bodyParser.urlencoded({ extended: true }));
		this.server.use(bodyParser.json());
		// this.server.use(rateLimiter);
		this.routesFolder = path.join(__dirname, '..', 'routes');
		this.database = new Database();
		this.server.get('/config', (req, res) => res.json({
			baseURL: config.backendLocation,
			serviceName: config.serviceName,
			maxFileSize: config.uploads.uploadMaxSize,
			chunkSize: config.uploads.chunkSize
		}));
	}

	registerAllTheRoutes() {
		jetpack.find(this.routesFolder, { matching: '*.js' }).forEach(routeFile => {
			const RouteClass = require(path.join('..', '..', '..', routeFile));
			let routes = [RouteClass];
			if (Array.isArray(RouteClass)) routes = RouteClass;
			for (const File of routes) {
				const route = new File();
				this.server[route.method](config.server.routePrefix + route.path, route.authorize.bind(route));
				log.info(`Found route ${route.method.toUpperCase()} ${config.server.routePrefix}${route.path}`);
			}
		});
	}

	writeFrontendConfig() {
		const template = oneliner`
			module.exports = {
				baseURL: '${config.backendLocation}',
				serviceName: '${config.serviceName}',
				maxFileSize: '${config.uploads.uploadMaxSize}',
				chunkSize: '${config.uploads.chunkSize}'
			}`;
		jetpack.write(path.join(__dirname, '..', '..', 'frontend', 'config.js'), template);
		log.success('Frontend config file generated successfully');
	}

	start() {
		jetpack.dir('uploads/chunks');
		jetpack.dir('uploads/thumbs/square');
		this.registerAllTheRoutes();
		this.server.listen(this.port, () => {
			log.success(`Backend ready and listening on port ${this.port}`);
		});
	}
}

new Server().start();
