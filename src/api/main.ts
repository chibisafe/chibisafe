import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import morgan from 'morgan';
import path from 'path';
import rfs from 'rotating-file-stream';
import rateLimit from 'express-rate-limit';
import jetpack from 'fs-jetpack';
import cron from 'cron';
// @ts-ignore - nuxt types can't be found - https://github.com/nuxt/nuxt.js/issues/7651
import { loadNuxt, build } from 'nuxt';

import Routes from './structures/routes';

const server = express();

const start = async () => {
	// Create the folders needed for uploads
	jetpack.dir('uploads/chunks');
	jetpack.dir('uploads/thumbs/square');
	jetpack.dir('uploads/thumbs/preview');

	// Create the server and set it up
	server.use('trust proxy');
	server.use(helmet());
	server.use(cors());
	server.use(morgan('dev'));
	server.use(express.urlencoded({ extended: true }));
	server.use(express.json());
	server.use(cors({ allowedHeaders: ['Accept', 'Authorization', 'Cache-Control', 'X-Requested-With', 'Content-Type', 'albumId', 'finishedChunks'] }));
	server.use((req, res, next) => {
		// This bypasses the headers.accept for album download, since it's accesed directly through the browser.
		if ((req.url.includes('/api/album/') || req.url.includes('/zip')) && req.method === 'GET') return next();
		// This bypasses the headers.accept if we are accessing the frontend
		if (!req.url.includes('/api/') && req.method === 'GET') return next();
		if (req.headers.accept?.includes('application/vnd.chibisafe.json')) return next();
		return res.status(405).json({ message: 'Incorrect `Accept` header provided' });
	});

	// Set up logs for production and dev environments
	if (process.env.NODE_ENV === 'production') {
		const accessLogStream = rfs.createStream('access.log', {
			interval: '1d', // rotate daily
			path: path.join(__dirname, '../../../logs', 'log')
		});
		server.use(morgan('combined', { stream: accessLogStream }));
	} else {
		server.use(morgan('dev'));
	}

	// Apply rate limiting to the api only
	server.use('/api/', rateLimit({
		windowMs: parseInt(process.env.RATE_LIMIT_WINDOW ?? '2000', 10),
		max: parseInt(process.env.RATE_LIMIT_MAX ?? '5', 10),
		message: 'Too many requests from this IP. Slow down dude.'
	}));

	// Scan and load routes into express
	await Routes.load(server);

	// Listen for incoming connections
	const listen = server.listen(process.env.port, () => {
		console.log(`> Chibisafe Server started on port ${process.env.port ?? 5000}.`);
	});
	listen.setTimeout(600000);

	// Serve the uploads
	server.use(express.static(path.join(__dirname, '../../../uploads')));

	const isProd = process.env.NODE_ENV === 'production';
	const nuxt = await loadNuxt(isProd ? 'start' : 'dev');
	server.use(nuxt.render);
	if (!isProd) build(nuxt);

	// TODO: move into the database config. (we can just show the crontab line for start, later on we can add dropdowns and stuff)
	new cron.CronJob('0 0 * * * *', Util.saveStatsToDb, null, true);
};

void start();
