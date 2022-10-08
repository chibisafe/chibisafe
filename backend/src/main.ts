import HyperExpress from 'hyper-express';
// @ts-ignore
import LiveDirectory from 'live-directory';
import jetpack from 'fs-jetpack';
import schedule from 'node-schedule';
import log from './utils/Log';
import process from 'node:process';
import path from 'node:path';
// import helmet from 'helmet';
import cors from 'cors';

import Routes from './structures/routes';

import { jumpstartStatistics } from './utils/StatsGenerator';
import { getEnvironmentDefaults } from './utils/Util';

// Process exit handler
// NOTE: Scheduler continues in subsequent nodemon restarts otherwise
const exitHandler = async (options: { [index: string]: any }, exitCode?: any) => {
	if (options.cleanup) {
		log.debug('Gracefully shutting down scheduler\u2026');
		await schedule.gracefulShutdown();
	}

	if (typeof exitCode === 'number' || options.exit) {
		process.exit(exitCode ?? 0);
	}
};

// Catches process is closing
process.on('exit', exitHandler.bind(null, { cleanup: true }));

// Catches Ctrl+C event
process.on('SIGINT', exitHandler.bind(null, { exit: true }));

// Catches "kill pid" (e.g. nodemon restart)
process.on('SIGUSR1', exitHandler.bind(null, { exit: true }));
process.on('SIGUSR2', exitHandler.bind(null, { exit: true }));

// Stray errors and exceptions capturers
process.on('uncaughtException', error => {
	log.error('Uncaught Exception:');
	log.error(error);
});

process.on('unhandledRejection', error => {
	log.error('Unhandled Rejection:');
	log.error(error);
});

const start = async () => {
	const server = new HyperExpress.Server({
		// TODO: Configurable? Should not trust proxy if directly running on an exposed port,
		// instead of behind a reverse proxy like Nginx, and/or CDNs like Cloudflare
		trust_proxy: true,
		fast_buffers: true
	});

	// TODO: Figure this out
	// server.use(helmet());
	server.use(
		cors({
			allowedHeaders: [
				'Accept',
				'Authorization',
				'Cache-Control',
				'X-Requested-With',
				'Content-Type',
				'albumId',
				'finishedChunks',
				'application/vnd.chibisafe.json' // I'm deprecating this header but will remain here for compatibility reasons
			]
		})
	);

	// Create the neccessary folders
	jetpack.dir('../uploads/zips');
	jetpack.dir('../uploads/chunks', { empty: true });
	jetpack.dir('../uploads/thumbs/square');
	jetpack.dir('../uploads/thumbs/preview');

	log.info('Chibisafe is starting with the following configuration:');
	log.info('');

	const defaults = getEnvironmentDefaults();
	for (const [key, value] of Object.entries(defaults)) {
		log.info(`${key}: ${JSON.stringify(value)}`);
	}

	log.info('');

	log.info('Loading routes...');
	log.info('');
	// Scan and load routes into express
	await Routes.load(server);

	if (process.env.NODE_ENV === 'production') {
		if (!jetpack.exists(path.join(__dirname, '..', '..', 'frontend', 'dist', 'index.html'))) {
			log.error('Frontend build not found, please run `npm run build` in the frontend directory');
			process.exit(1);
		}

		const LiveAssets = new LiveDirectory({
			path: path.join(__dirname, '..', 'dist', 'site')
		});

		server.get('/', (req, res) => {
			const file = LiveAssets.get('index.html');
			return res.type(file.extension).send(file.buffer);
		});

		server.get('/*', (req, res) => {
			const file = LiveAssets.get(req.path);
			if (!file) return res.status(404).send('Not found');
			return res.type(file.extension).send(file.buffer);
		});
	}

	// Start the server
	await server.listen(8000);
	log.info('');
	log.info('Server ready on port 8000');

	// Jumpstart statistics scheduler
	await jumpstartStatistics();
};

void start();
