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
// import { unholdFileIdentifiers } from './utils/File';

declare module 'fastify' {
	interface FastifyInstance {
		logger: typeof log;
	}

	interface FastifyRequest {
		logger: typeof log;
	}

	interface FastifyReply {
		logger: typeof log;
	}
}

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

	// Create the Fastify server
	const server = fastify({
		trustProxy: true,
		connectionTimeout: 600000
	});

	// Enable form-data parsing
	server.addContentTypeParser('multipart/form-data', (request, payload, done) => done(null));

	// Add log decorators to server, request and reply
	server.decorate('logger', log);
	server.decorateReply('logger', log);
	server.decorateRequest('logger', log);

	// Add decorator for the user object to use with FastifyRequest
	server.decorateRequest('user', '');

	// These hooks and decorators are to hold unique identifiers in memory
	server.addHook('onResponse', async (request, reply) => {
		// http logging
		server.logger.info(`${request.ip} - ${request.method} ${request.url} - ${reply.statusCode}`);
	});

	await server.register(helmet, { crossOriginResourcePolicy: false });
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
			static: true
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
				req.logger.debug('hi');
			}
		});

		server.addHook('onRequest', (req, reply, next) => {
			req.logger.debug(req);
			console.log(req);

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

			if (req.url === '/' || route) return reply.type('html').send(newBuffer);

			const file = LiveAssets.get(req.url.slice(1));
			if (file) {
				// @ts-ignore
				return reply.type(file.extension).send(file.buffer);
			}

			next();
		});
	}

	// Serve uploads
	await server.register(fstatic, {
		root: path.join(__dirname, '..', '..', 'uploads')
	});

	// Start the server
	await server.listen({ port: Number(SETTINGS.port) });

	// Jumpstart statistics scheduler
	await jumpstartStatistics();
};

void start();
