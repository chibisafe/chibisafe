import * as dotenv from 'dotenv';

import fastify from 'fastify';
import type { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';

import helmet from '@fastify/helmet';
import cors from '@fastify/cors';
import fstatic from '@fastify/static';

import LiveDirectory from 'live-directory';

import jetpack from 'fs-jetpack';
// import schedule from 'node-schedule';
import log from './utils/Log';
import process from 'node:process';
import path from 'node:path';
import { Buffer } from 'node:buffer';

import Routes from './structures/routes';

import Requirements from './utils/Requirements';

import { jumpstartStatistics } from './utils/StatsGenerator';
import { SETTINGS, loadSettings } from './structures/settings';
import { createAdminUserIfNotExists } from './utils/Util';

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

	// Create the settings in the database
	await loadSettings();

	// Create the admin user if it doesn't exist
	await createAdminUserIfNotExists();

	// Create the pino logger
	const envToLogger = {
		development: {
			transport: {
				target: 'pino-pretty',
				options: {
					translateTime: 'HH:MM:ss Z',
					ignore: 'pid,hostname'
				}
			},
			level: 'debug',
			sync: true
		},
		production: {
			serializers: {
				res(reply: FastifyReply) {
					return {
						statusCode: reply.statusCode
					};
				},
				req(request: FastifyRequest) {
					return {
						method: request.method,
						url: request.url,
						parameters: request.params,
						remoteAddress: request.ip
					};
				}
			},
			file: '../logs/chibisafe.log'
		}
	};

	// Create the Fastify server
	const server = fastify({
		trustProxy: true,
		connectionTimeout: 600000,
		// @ts-ignore-error can't use process.env as its undefined
		logger: process.env.NODE_ENV === 'production' ? envToLogger.production : envToLogger.development
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
	jetpack.dir('../uploads/tmp');
	jetpack.dir('../uploads/zips');
	jetpack.dir('../uploads/thumbs/square');
	jetpack.dir('../uploads/thumbs/preview');

	log.debug('Chibisafe is starting with the following configuration:');
	log.debug('');

	const defaults = SETTINGS;
	for (const [key, value] of Object.entries(defaults)) {
		log.debug(`${key}: ${JSON.stringify(value)}`);
	}

	log.debug('');
	log.debug('Loading routes...');
	log.debug('');

	// Scan and load routes into fastify
	await Routes.load(server);

	if (process.env.NODE_ENV === 'production') {
		if (!jetpack.exists(path.join(__dirname, '..', 'dist', 'site', 'index.html'))) {
			log.error('Frontend build not found, please run `npm run build` in the frontend directory first');
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

		// Prepare index.html to be served with the necessary meta tags in place
		let indexHTML = jetpack.read(path.join(__dirname, '..', 'dist', 'site', 'index.html'), 'utf8');
		if (!indexHTML) {
			log.error('There was a problem parsing the frontend');
			process.exit(1);
		}

		indexHTML = indexHTML.replace(/{{title}}/g, SETTINGS.serviceName);
		indexHTML = indexHTML.replace(/{{description}}/g, SETTINGS.metaDescription);
		indexHTML = indexHTML.replace(/{{keywords}}/g, SETTINGS.metaKeywords);
		indexHTML = indexHTML.replace(/{{twitter}}/g, SETTINGS.metaTwitterHandle);
		indexHTML = indexHTML.replace(/{{domain}}/g, SETTINGS.domain);
		const newBuffer = Buffer.from(indexHTML);

		server.route({
			method: 'GET',
			url: '/',
			handler: (req: FastifyRequest, res: FastifyReply) => {
				req.log.debug('hi');
			}
		});

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
				'/tos'
			];

			const route = routes.some(r => req.url.startsWith(r));

			if (req.url === '/' || route) return reply.type('text/html').send(newBuffer);

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
		root: path.join(__dirname, '..', '..', 'uploads')
	});

	// Start the server
	await server.listen({ port: Number(SETTINGS.port), host: SETTINGS.host as string });
	// Jumpstart statistics scheduler
	await jumpstartStatistics();
};

void start();
