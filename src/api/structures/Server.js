require('dotenv').config();

const log = require('../utils/Log');
const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const RateLimit = require('express-rate-limit');
const bodyParser = require('body-parser');
const jetpack = require('fs-jetpack');
const path = require('path');

const rateLimiter = new RateLimit({
	windowMs: parseInt(process.env.RATE_LIMIT_WINDOW, 10),
	max: parseInt(process.env.RATE_LIMIT_MAX, 10),
	delayMs: 0
});

class Server {
	constructor() {
		this.port = parseInt(process.env.SERVER_PORT, 10);
		this.server = express();
		this.server.set('trust proxy', 1);
		this.server.use(helmet());
		this.server.use(cors({ allowedHeaders: ['Accept', 'Authorization', 'Cache-Control', 'X-Requested-With', 'Content-Type', 'albumId'] }));
		this.server.use((req, res, next) => {
			// This bypasses the headers.accept for album download, since it's accesed directly through the browser.
			if ((req.url.includes('/api/album/') || req.url.includes('/zip')) && req.method === 'GET') return next();
			// This bypasses the headers.accept if we are accessing the frontend
			if (!req.url.includes('/api/') && req.method === 'GET') return next();
			if (req.headers.accept && req.headers.accept.includes('application/vnd.lolisafe.json')) return next();
			return res.status(405).json({ message: 'Incorrect `Accept` header provided' });
		});
		this.server.use(bodyParser.urlencoded({ extended: true }));
		this.server.use(bodyParser.json());
		// this.server.use(rateLimiter);

		// Serve the uploads
		this.server.use(express.static(path.join(__dirname, '..', '..', '..', 'uploads')));
		this.routesFolder = path.join(__dirname, '..', 'routes');
	}

	registerAllTheRoutes() {
		jetpack.find(this.routesFolder, { matching: '*.js' }).forEach(routeFile => {
			const RouteClass = require(path.join('..', '..', '..', routeFile));
			let routes = [RouteClass];
			if (Array.isArray(RouteClass)) routes = RouteClass;
			for (const File of routes) {
				const route = new File();
				this.server[route.method](process.env.ROUTE_PREFIX + route.path, route.authorize.bind(route));
				log.info(`Found route ${route.method.toUpperCase()} ${process.env.ROUTE_PREFIX}${route.path}`);
			}
		});
	}

	serveNuxt() {
		// Serve the frontend if we are in production mode
		if (process.env.NODE_ENV === 'production') {
			this.server.use(express.static(path.join(__dirname, '..', '..', '..', 'dist')));
		}

		/*
			For vue router to work with express we need this fallback.
			After all the routes are loaded and the static files handled and if the
			user is trying to access a non-mapped route we serve the website instead
			since it has routes of it's own that don't work if accessed directly
		*/
		this.server.all('*', (_req, res) => {
			try {
				res.sendFile(path.join(__dirname, '..', '..', '..', 'dist', 'index.html'));
			} catch (error) {
				res.json({ success: false, message: 'Something went wrong' });
			}
		});
	}

	start() {
		jetpack.dir('uploads/chunks');
		jetpack.dir('uploads/thumbs/square');
		this.registerAllTheRoutes();
		this.serveNuxt();
		const server = this.server.listen(this.port, '0.0.0.0', () => {
			log.success(`Backend ready and listening on port ${this.port}`);
		});
		server.setTimeout(600000);
	}
}

new Server().start();
