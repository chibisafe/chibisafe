import fastify from 'fastify';
import helmet from '@fastify/helmet';
import cors from '@fastify/cors';
import fstatic from '@fastify/static';
import LiveDirectory from 'live-directory';
import jetpack from 'fs-jetpack';
import process from 'node:process';
import path from 'node:path';
import { Buffer } from 'node:buffer';

import Routes from './structures/routes';
import Requirements from './utils/Requirements';

import { jumpstartStatistics } from './utils/StatsGenerator';
import { SETTINGS, loadSettings } from './structures/settings';
import { createAdminUserIfNotExists } from './utils/Util';
import { Logger } from './utils/Logger';

// Create the Fastify server
const server = fastify({
	trustProxy: true,
	connectionTimeout: 600000,
	// @ts-ignore-error can't use process.env as its undefined
	logger: process.env.NODE_ENV === 'production' ? Logger.production : Logger.development
});

export const log = server.log;

let htmlBuffer: Buffer | null = null;

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
	// Check the environment has all the requirements before running chibisafe
	await Requirements(server.log);

	// Create the settings in the database
	await loadSettings();

	// Create the admin user if it doesn't exist
	await createAdminUserIfNotExists();

	// Add global rate limit
	await server.register(import('@fastify/rate-limit'), {
		global: true,
		max: SETTINGS.rateLimitMax,
		timeWindow: SETTINGS.rateLimitWindow
	});

	// Enable form-data parsing
	server.addContentTypeParser('multipart/form-data', (request, payload, done) => done(null));

	// Add decorator for the user object to use with FastifyRequest
	server.decorateRequest('user', '');

	await server.register(helmet, { crossOriginResourcePolicy: false, contentSecurityPolicy: false });
	await server.register(cors, {
		preflightContinue: true,
		allowedHeaders: [
			'Accept',
			'Authorization',
			'Connection',
			'Cache-Control',
			'X-Requested-With',
			'Content-Type',
			'albumUuid',
			'X-API-KEY',
			'application/vnd.chibisafe.json', // I'm deprecating this header but will remain here for compatibility reasons
			// @chibisafe/uploarder headers
			'chibi-chunk-number',
			'chibi-chunks-total',
			'chibi-uuid'
		]
	});

	// Create the neccessary folders

	jetpack.dir(path.join(__dirname, '..', '..', '..', 'uploads', 'tmp'));
	jetpack.dir(path.join(__dirname, '..', '..', '..', 'uploads', 'zips'));
	jetpack.dir(path.join(__dirname, '..', '..', '..', 'uploads', 'thumbs', 'square'));
	jetpack.dir(path.join(__dirname, '..', '..', '..', 'uploads', 'thumbs', 'preview'));

	server.log.debug('Chibisafe is starting with the following configuration:');
	server.log.debug('');

	const defaults = SETTINGS;
	for (const [key, value] of Object.entries(defaults)) {
		server.log.debug(`${key}: ${JSON.stringify(value)}`);
	}

	server.log.debug('');
	server.log.debug('Loading routes...');
	server.log.debug('');

	// Scan and load routes into fastify
	// @ts-expect-error it's fine
	await Routes.load(server);

	if (process.env.NODE_ENV === 'production') {
		if (!jetpack.exists(path.join(__dirname, '..', 'dist', 'site', 'index.html'))) {
			server.log.error('Frontend build not found, please run `npm run build` in the frontend directory first');
			process.exit(1);
		}

		// @ts-ignore
		const LiveAssets = new LiveDirectory(path.join(__dirname, '..', 'dist', 'site'), {
			static: true,
			cache: {
				max_file_count: 50,
				max_file_size: 1024 * 1024 * 2.5
			}
		});

		// Wait for the html buffer with replaced values to be ready
		await getHtmlBuffer();

		server.addHook('onRequest', (req, reply, next) => {
			req.log.debug(req);

			if (req.method !== 'GET' && req.method !== 'HEAD') {
				next();
				return;
			}

			const routes = [
				'/dashboard',
				'/invite',
				'/login',
				'/register',
				'/faq',
				'/features',
				'/about',
				'/privacy',
				'/tos',
				'/a/'
			];

			const route = routes.some(r => req.url.startsWith(r));

			if (req.url === '/' || route) return reply.type('text/html').send(htmlBuffer);

			const file = LiveAssets.get(req.url.slice(1));
			if (!file) {
				next();
				return;
			}

			// @ts-ignore
			const extension = req.url.slice(1).split('.').pop() as string;

			// Map extension to content type
			const contentType = {
				js: 'text/javascript',
				css: 'text/css',
				html: 'text/html',
				ico: 'image/x-icon',
				png: 'image/png',
				jpg: 'image/jpeg',
				svg: 'image/svg+xml'
			};

			return (
				reply
					.header('etag', file.etag)
					.header('Cache-Control', 'max-age=604800, stale-while-revalidate=86400')
					// @ts-expect-error contentType[extension]
					.type(contentType[extension])
					.send(file.cached ? file.content : file.stream())
			);
		});
	}

	// Serve uploads
	await server.register(fstatic, {
		root: path.join(__dirname, '..', '..', '..', 'uploads')
	});

	// Start the server
	await server.listen({ port: Number(SETTINGS.port), host: SETTINGS.host as string });
	if (process.env.NODE_ENV === 'production')
		console.log(`Chibisafe is listening on ${SETTINGS.host}:${SETTINGS.port}`);
	// Jumpstart statistics scheduler
	await jumpstartStatistics();
};

export const getHtmlBuffer = async () => {
	let indexHTML = jetpack.read(path.join(__dirname, '..', 'dist', 'site', 'index.html'), 'utf8');
	if (!indexHTML) {
		server.log.error('There was a problem parsing the frontend');
		process.exit(1);
	}

	indexHTML = indexHTML.replaceAll('{{title}}', SETTINGS.serviceName);
	indexHTML = indexHTML.replaceAll('{{description}}', SETTINGS.metaDescription);
	indexHTML = indexHTML.replaceAll('{{keywords}}', SETTINGS.metaKeywords);
	indexHTML = indexHTML.replaceAll('{{twitter}}', SETTINGS.metaTwitterHandle);
	indexHTML = indexHTML.replaceAll('{{domain}}', SETTINGS.domain);

	const settings = {
		background: SETTINGS.backgroundImageURL,
		chunkSize: SETTINGS.chunkSize,
		logo: SETTINGS.logoURL,
		maxFileSize: SETTINGS.maxSize,
		serviceName: SETTINGS.serviceName,
		publicMode: SETTINGS.publicMode,
		userAccounts: SETTINGS.userAccounts
	};

	indexHTML = indexHTML.replaceAll(
		'</body>',
		`<script>window.__CHIBISAFE__ = ${JSON.stringify(settings)};</script></body>`
	);

	htmlBuffer = Buffer.from(indexHTML);
};

void start();
