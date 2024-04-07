import process from 'node:process';
import { URL, fileURLToPath } from 'node:url';
import { fastifyCookie } from '@fastify/cookie';
import cors from '@fastify/cors';
import helmet from '@fastify/helmet';
import fstatic from '@fastify/static';
import fastify from 'fastify';
import { jsonSchemaTransform } from 'fastify-type-provider-zod';
import jetpack from 'fs-jetpack';
import { cleanup } from 'unzipit';
import Routes from './structures/routes.js';
import { SETTINGS, loadSettings } from './structures/settings.js';
import Docs from './utils/Docs.js';
import { log } from './utils/Logger.js';
import Requirements from './utils/Requirements.js';
import { jumpstartStatistics } from './utils/StatsGenerator.js';
import { startUpdateCheckSchedule } from './utils/UpdateCheck.js';
import { createAdminUserIfNotExists, VERSION } from './utils/Util.js';
import { fileWatcher, getFileWatcher } from './utils/Watcher.js';

// Create the Fastify server
const server = fastify({
	trustProxy: true,
	connectionTimeout: 600000,
	// @ts-ignore-error can't use process.env as its undefined
	logger: log,
	disableRequestLogging: true
});

const watcher = getFileWatcher();

process.on('SIGINT', async () => {
	console.log('SIGINT received...');
	cleanup();
	await watcher.close();
	await server.close();
});

process.on('SIGTERM', async () => {
	console.log('SIGTERM received...');
	cleanup();
	await watcher.close();
	await server.close();
});

// Stray errors and exceptions capturers
process.on('uncaughtException', error => {
	server.log.error('Uncaught Exception:');
	server.log.error(error);
});

process.on('unhandledRejection', error => {
	server.log.error('Unhandled Rejection:');
	server.log.error(error);
});

const start = async () => {
	server.log.info(`Running Chibisafe v${VERSION}`);
	// Check the environment has all the requirements before running chibisafe
	await Requirements(server.log);

	// Create the settings in the database
	await loadSettings();

	// Create the admin user if it doesn't exist
	await createAdminUserIfNotExists();

	// Register the fastify-sensible plugin
	await server.register(import('@fastify/sensible'));

	// Create the OpenAPI documentation
	await server.register(import('@fastify/swagger'), { ...Docs, transform: jsonSchemaTransform });
	await server.register(import('@scalar/fastify-api-reference'), {
		routePrefix: '/docs',
		configuration: {
			spec: {
				content: () => server.swagger()
			}
		}
	});

	// Enable cookie parsing
	await server.register(fastifyCookie, {
		secret: SETTINGS.secret,
		hook: 'onRequest',
		parseOptions: {}
	});

	// Route error handler
	// @ts-ignore
	// eslint-disable-next-line promise/prefer-await-to-callbacks
	server.setErrorHandler((error, _, res) => {
		if (error.statusCode) {
			return res.send(error);
		} else {
			server.log.error(error);
			return res.internalServerError('Something went wrong');
		}
	});

	server.addHook('onResponse', (request, reply, done) => {
		if (
			!['/thumbs/', '/assets/'].some(path => request.url.startsWith(path)) ||
			process.env.NODE_ENV !== 'production'
		) {
			server.log.info({
				method: request.method,
				url: request.url,
				statusCode: reply.statusCode,
				responseTime: Math.ceil(reply.elapsedTime),
				ip: request.ip
			});
		}

		done();
	});

	// Enable form-data parsing
	server.addContentTypeParser('multipart/form-data', (_, __, done) => done(null));

	// Add decorator for the user object to use with FastifyRequest
	server.decorateRequest('user', '');

	await server.register(helmet, {
		crossOriginResourcePolicy: false,
		contentSecurityPolicy: false,
		crossOriginEmbedderPolicy: false
	});

	await server.register(cors, {
		origin: true,
		credentials: true,
		allowedHeaders: [
			'Accept',
			'Authorization',
			'Connection',
			'Cache-Control',
			'X-Requested-With',
			'Content-Type',
			'albumUuid',
			'X-API-KEY',
			// @chibisafe/uploarder headers
			'chibi-chunk-number',
			'chibi-chunks-total',
			'chibi-uuid'
		]
	});

	// Create the neccessary folders

	jetpack.dir(fileURLToPath(new URL('../../../uploads/live', import.meta.url)));
	jetpack.dir(fileURLToPath(new URL('../../../uploads/tmp', import.meta.url)));
	jetpack.dir(fileURLToPath(new URL('../../../uploads/zips', import.meta.url)));
	jetpack.dir(fileURLToPath(new URL('../../../uploads/thumbs/preview', import.meta.url)));

	// Chokidar implementation
	fileWatcher();

	server.log.debug('Chibisafe is starting with the following configuration:');
	server.log.debug('');

	const defaults = SETTINGS;
	for (const [key, value] of Object.entries(defaults)) {
		server.log.debug(`${key}: ${JSON.stringify(value)}`);
	}

	server.log.debug('');
	server.log.debug('Loading routes...');
	server.log.debug('');

	// Creating an scoped server instance to pass to the routes in
	// order to limit the rate-limit plugin to only the routes.
	await server.register(async instance => {
		// Scan and load routes into fastify
		await Routes.load(instance);
	});

	if (process.env.NODE_ENV === 'production') {
		server.addHook('onRequest', (req, _, next) => {
			req.log.debug(req);
			next();
		});
	}

	// Serve uploads only if the user is running in DEV mode
	if (process.env.NODE_ENV !== 'production') {
		await server.register(fstatic, {
			root: fileURLToPath(new URL('../../../uploads', import.meta.url))
		});
	}

	// Start the server
	await server.listen({ port: Number(SETTINGS.port), host: SETTINGS.host as string });

	// Uncomment this to generate a swagger.yml file with the OpenAPI documentation
	// const yaml = server.swagger({ yaml: true });
	// await jetpack.writeAsync('./swagger.yml', yaml);

	// Jumpstart statistics scheduler
	await jumpstartStatistics();

	// Check for updates
	await startUpdateCheckSchedule();
};

void start();
