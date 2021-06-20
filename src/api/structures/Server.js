require('dotenv').config();

if (!process.env.SERVER_PORT) {
	console.log('Run the setup script first or fill the .env file manually before starting');
	process.exit(0);
}

if (!process.env.DOMAIN) {
	console.log('You failed to provide a domain for your instance. Edit the .env file manually and fix it.');
	process.exit(0);
}

const { loadNuxt, build } = require('nuxt');
const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const RateLimit = require('express-rate-limit');
const bodyParser = require('body-parser');
const jetpack = require('fs-jetpack');
const path = require('path');
const morgan = require('morgan');
const rfs = require('rotating-file-stream');
const CronJob = require('cron').CronJob;
const log = require('../utils/Log');

const Util = require('../utils/Util');
// eslint-disable-next-line no-unused-vars
const rateLimiter = new RateLimit({
	windowMs: parseInt(Util.config.rateLimitWindow, 10),
	max: parseInt(Util.config.rateLimitMax, 10),
	delayMs: 0
});

class Server {
	constructor() {
		this.port = parseInt(process.env.SERVER_PORT, 10);
		this.server = express();
		this.server.set('trust proxy', 1);
		this.server.use(helmet());
		this.server.use(cors({ allowedHeaders: ['Accept', 'Authorization', 'Cache-Control', 'X-Requested-With', 'Content-Type', 'albumId', 'finishedChunks'] }));
		this.server.use((req, res, next) => {
			// This bypasses the headers.accept for album download, since it's accesed directly through the browser.
			if ((req.url.includes('/api/album/') || req.url.includes('/zip')) && req.method === 'GET') return next();
			// This bypasses the headers.accept if we are accessing the frontend
			if (!req.url.includes('/api/') && req.method === 'GET') return next();
			if (req.headers.accept && req.headers.accept.includes('application/vnd.chibisafe.json')) return next();
			return res.status(405).json({ message: 'Incorrect `Accept` header provided' });
		});
		this.server.use(bodyParser.urlencoded({ extended: true }));
		this.server.use(bodyParser.json());

		if (process.env.NODE_ENV === 'production') {
			const accessLogStream = rfs.createStream('access.log', {
				interval: '1d', // rotate daily
				path: path.join(__dirname, '../../../logs', 'log')
			});
			this.server.use(morgan('combined', { stream: accessLogStream }));
		}

		// Apply rate limiting to the api only
		this.server.use('/api/', rateLimiter);

		// Serve the uploads
		this.server.use(express.static(path.join(__dirname, '../../../uploads')));
		this.routesFolder = path.join(__dirname, '../routes');

		// Save the cron job instances in case we want to stop them later
		this.jobs = {};
	}

	registerAllTheRoutes() {
		jetpack.find(this.routesFolder, { matching: '*.js' }).forEach(routeFile => {
			const RouteClass = require(path.join('../../../', routeFile));
			let routes = [RouteClass];
			if (Array.isArray(RouteClass)) routes = RouteClass;
			for (const File of routes) {
				try {
					const route = new File();
					this.server[route.method](`/api${route.path}`, route.authorize.bind(route));
					log.info(`Found route ${route.method.toUpperCase()} /api${route.path}`);
				} catch (e) {
					log.error(`Failed loading route from file ${routeFile} with error: ${e.message}`);
				}
			}
		});
	}

	async serveNuxt() {
		const isProd = process.env.NODE_ENV === 'production';
		const nuxt = await loadNuxt(isProd ? 'start' : 'dev');
		this.server.use(nuxt.render);
		if (!isProd) {
			build(nuxt);
		}
	}

	createJobs() {
		// TODO: move into the database config. (we can just show the crontab line for start, later on we can add dropdowns and stuff)
		this.jobs.stats = new CronJob('0 0 * * * *', Util.saveStatsToDb, null, true);
	}

	start() {
		jetpack.dir('uploads/chunks');
		jetpack.dir('uploads/thumbs/square');
		jetpack.dir('uploads/thumbs/preview');
		this.registerAllTheRoutes();
		this.serveNuxt();
		const server = this.server.listen(this.port, () => {
			log.success(`Backend ready and listening on port ${this.port}`);
		});
		server.setTimeout(600000);

		this.createJobs();
	}
}

const start = async () => {
	const conf = await Util.config;
	new Server().start();
};

start();

