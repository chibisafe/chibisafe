import * as dotenv from 'dotenv';

import type { Request, Response, MiddlewareNext } from 'hyper-express';
import HyperExpress from 'hyper-express';
// @ts-ignore
import LiveDirectory from 'live-directory';
import jetpack from 'fs-jetpack';
// import schedule from 'node-schedule';
import log from './utils/Log';
import process from 'node:process';
import path from 'node:path';
// import helmet from 'helmet';
import cors from 'cors';

import Routes from './structures/routes';
import Serve from './structures/serve';

import Requirements from './utils/Requirements';

import { jumpstartStatistics } from './utils/StatsGenerator';
import { getEnvironmentDefaults } from './utils/Util';

// Since we're using the same .env file for both the frontend and backend, we need to specify the path
dotenv.config({
	path: path.join(__dirname, '..', '..', '.env')
});

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
	// Check the environment has all the requirements before running chibisafe
	await Requirements();

	// Create the HyperExpress server
	const server = new HyperExpress.Server({
		trust_proxy: true,
		fast_buffers: true
	});

	// server.use(helmet());
	server.use(
		cors({
			allowedHeaders: [
				'Accept',
				'Authorization',
				'Cache-Control',
				'X-Requested-With',
				'Content-Type',
				'albumUuid',
				// 'finishedChunks', // Not used, we simply check if Content-Type is 'application/json'
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

		// @ts-ignore -- Hyper's typings for this overload seem to be missing
		server.use((req: Request, res: Response, next: MiddlewareNext) => {
			if (req.method === 'GET' || req.method === 'HEAD') {
				const page = req.path === '/' ? 'index.html' : req.path.slice(1);
				const file = LiveAssets.get(page);
				if (file) {
					return res.type(file.extension).send(file.buffer);
				}
			}

			next();
		});
	}

	// Serve uploads
	server.get('/*', Serve);
	server.head('/*', Serve);

	// Essentially unused for GET and HEAD due to Serve's handlers
	server.set_not_found_handler((req: Request, res: Response) => {
		res.status(404).send('Not found');
	});

	server.set_error_handler((req: Request, res: Response, error: Error) => {
		log.error(error);
		res.status(500).send('Internal server error');
	});

	// Start the server
	await server.listen(8000);
	log.info('');
	log.info('Server ready on port 8000');

	// Jumpstart statistics scheduler
	await jumpstartStatistics();
};

void start();
