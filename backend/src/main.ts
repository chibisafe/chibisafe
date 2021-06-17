import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import morgan from 'morgan';
import path from 'path';
import rfs from 'rotating-file-stream';
import ratelimit from 'express-rate-limit';
// import { loadNuxt, build } from 'nuxt';

import Routes from './structures/routes';

const server = express();

const start = async () => {
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

	const rateLimiter = new RateLimit({
		windowMs: parseInt(process.env.RATE_LIMIT_WINDOW ?? '2000', 10),
		max: parseInt(process.env.RATE_LIMIT_MAX ?? '5', 10),
		delayMs: 0
	});

	// Set up logs for production and dev environments
	if (process.env.NODE_ENV === 'production') {
		const accessLogStream = rfs.createStream('access.log', {
			interval: '1d', // rotate daily
			path: path.join(__dirname, '../../logs', 'log')
		});
		server.use(morgan('combined', { stream: accessLogStream }));
	} else {
		server.use(morgan('dev'));
	}

	// Apply rate limiting to the api only
	server.use('/api/', rateLimiter);

	// Scan and load routes into express
	await Routes.load(server);
	server.listen(process.env.port, () => {
		console.log(`> Chibisafe Server started on port ${process.env.port ?? 5000}.`);
	});

	if (process.env.nuxtStatic) {
		server.use(express.static(path.join(__dirname, '..', '..', 'frontend', 'dist')));
	} else {
		// void serveNuxt();
	}
};

/*
const serveNuxt = async () => {
	const isProd = process.env.NODE_ENV === 'production';
	const nuxt = await loadNuxt(isProd ? 'start' : 'dev');
	server.use(nuxt.render);
	if (!isProd) build(nuxt);
};
*/

void start();
