// import express from 'express';
import fastify from 'fastify';
import helmet from 'fastify-helmet';
import cors from 'fastify-cors';
import formbody from 'fastify-formbody';
import fstatic from 'fastify-static';
import path from 'path';
import rateLimit from 'fastify-rate-limit';
import jetpack from 'fs-jetpack';
// import cron from 'cron';
// @ts-ignore - nuxt types can't be found - https://github.com/nuxt/nuxt.js/issues/7651
// import { loadNuxt, build } from 'nuxt';

import Routes from './structures/routes';

// const server = express();
const server = fastify({
	trustProxy: true,
	logger: {
		serializers: {
			req(request) {
				return {
					ip: request.hostname,
					method: request.method,
					url: request.url
				};
			},
			res(reply) {
				return {
					statusCode: reply.statusCode
				};
			}
		},
		prettyPrint: {
			translateTime: 'SYS:yyyy-mm-dd HH:MM:ss.l',
			ignore: 'pid,hostname,reqId,req,res,responseTime',
			/*
				TODO:
				Find a way to merge incoming request and request completed into 1 line using
				messageFormat as a function instead of a string.
				Maybe even set a new flag under log like log.app instead of log.info
				to be able to print logs without req and res information

				[2021-06-21 19:22:21.553] INFO: incoming request [localhost:5000 - GET /api/verify - ]
				[2021-06-21 19:22:21.556] INFO: request completed [ -   - 401]
			*/
			messageFormat: '{msg} [{req.ip} - {req.method} {req.url} - {res.statusCode}]'
		}
	},
	connectionTimeout: 600000
});

const start = async () => {
	// Create the folders needed for uploads
	jetpack.dir('uploads/chunks');
	jetpack.dir('uploads/thumbs/square');
	jetpack.dir('uploads/thumbs/preview');

	// Create the server and set it up
	void server.register(helmet);
	void server.register(cors, {
		allowedHeaders: ['Accept', 'Authorization', 'Cache-Control', 'X-Requested-With', 'Content-Type', 'albumId', 'finishedChunks']
	});
	void server.register(formbody);

	server.addHook('onRequest', (req, reply, next) => {
		// This bypasses the headers.accept for album download, since it's accesed directly through the browser.
		if ((req.url.includes('/api/album/') || req.url.includes('/zip')) && req.method === 'GET') return next();
		// This bypasses the headers.accept if we are accessing the frontend
		if (!req.url.includes('/api/') && req.method === 'GET') return next();
		if (req.headers.accept?.includes('application/vnd.chibisafe.json')) return next();
		return reply.status(405).send({ message: 'Incorrect `Accept` header provided' });
	});

	// Apply rate limiting to the api only
	// TODO: Find a way to only apply this to /api routes
	void server.register(rateLimit, {
		global: false,
		max: parseInt(process.env.RATE_LIMIT_MAX ?? '5', 10),
		timeWindow: parseInt(process.env.RATE_LIMIT_WINDOW ?? '2000', 10)
	});

	// Scan and load routes into express
	await Routes.load(server);

	// Listen for incoming connections
	void server.listen(process.env.port ?? 5000);

	// Serve the uploads
	void server.register(fstatic, {
		root: path.join(__dirname, '../../uploads')
	});

	// TODO: Enable this after Utils is ported to TypeScript
	/*
	const isProd = process.env.NODE_ENV === 'production';
	const nuxt = await loadNuxt(isProd ? 'start' : 'dev');
	void server.register(nuxt.render);
	if (!isProd) build(nuxt);
	*/

	// TODO: move into the database config. (we can just show the crontab line for start, later on we can add dropdowns and stuff)
	// new cron.CronJob('0 0 * * * *', Util.saveStatsToDb, null, true);
};

export const log = server.log;
void start();
