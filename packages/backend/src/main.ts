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

	// Register the fastify-sensible plugin
	await server.register(import('@fastify/sensible'));

	await server.register(import('@fastify/swagger'), {
		openapi: {
			info: {
				title: 'Chibisafe API',
				version: (process.env.npm_package_version as string) ?? 'unknown'
			},
			tags: [
				{
					name: 'Auth',
					description: 'Authentication routes.'
				},
				{
					name: 'User',
					description: 'Routes that return data related to the authenticated user.'
				},
				{
					name: 'Albums',
					description: 'Routes that return data related to albums.'
				},
				{
					name: 'Files',
					description: 'Routes that return data related to files.'
				},
				{
					name: 'Tags',
					description: 'Routes that return data related to tags.'
				},
				{
					name: 'Invites',
					description: 'Routes that return data related to invites.'
				},
				{
					name: 'IP Management',
					description: 'Routes that return data related to IP Management.'
				},
				{
					name: 'Admin',
					description: 'Routes that return data related to the admin panel.'
				},
				{
					name: 'API Key',
					description: 'Routes that can be used with an API Key.'
				},
				{
					name: 'Server',
					description: 'Routes that returns info about the server instance.'
				}
			]
		}
	});

	await server.register(import('@fastify/swagger-ui'), {
		routePrefix: '/swagger'
	});

	// Route error handler
	// eslint-disable-next-line promise/prefer-await-to-callbacks
	server.setErrorHandler((error, req, res) => {
		if (error.statusCode) {
			return res.send(error);
		} else {
			server.log.error(error);
			res.internalServerError('Something went wrong');
		}
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

// TODO: move to a better place.

const filesSchema = {
	name: { type: 'string', description: 'The name of the file.', example: 'cat.png' },
	createdAt: {
		type: 'string',
		description: 'The date the file was uploaded.',
		example: '2021-01-01T00:00:00.000Z'
	},
	ip: {
		type: 'string',
		description: 'The IP address of the uploader.',
		example: '1.1.1.1'
	},
	original: {
		type: 'string',
		description: 'The original name of the file.',
		example: 'cat.png'
	},
	uuid: {
		type: 'string',
		description: 'The uuid of the file.',
		example: '1453821d-aaf9-435c-8a51-e3f16f7d2ee5'
	},
	hash: {
		type: 'string',
		description: 'The hash of the file.',
		example: 'd41d8cd98f00b204e9800998ecf8427e'
	},
	size: {
		type: 'number',
		description: 'The size of the file in bytes.',
		example: 123456
	},
	type: {
		type: 'string',
		description: 'The type of the file.',
		example: 'image/png'
	},
	url: {
		type: 'string',
		description: 'The URL of the file.',
		example: 'https://example.com/cat.png'
	},
	thumb: {
		type: 'string',
		description: 'The URL of the thumbnail of the file.',
		example: 'https://example.com/cat.png'
	},
	thumbSquare: {
		type: 'string',
		description: 'The URL of the square thumbnail of the file.',
		example: 'https://example.com/cat.png'
	},
	preview: {
		type: 'string',
		description: 'The URL of the preview of the file.',
		example: 'https://example.com/cat.png'
	}
};

server.addSchema({
	$id: 'FilesAsUser',
	type: 'object',
	description: 'The file object.',
	properties: {
		...filesSchema
	}
});

server.addSchema({
	$id: 'FilesAsAdmin',
	type: 'object',
	description: 'The file object.',
	properties: {
		...filesSchema,
		user: {
			type: 'object',
			description: 'The user that uploaded the file.',
			properties: {
				uuid: {
					type: 'string',
					description: "The user's UUID.",
					example: '1453821d-aaf9-435c-8a51-e3f16f7d2ee5'
				},
				username: {
					type: 'string',
					description: "The user's username.",
					example: 'admin'
				}
			}
		}
	}
});

server.addSchema({
	$id: 'UserAsAdmin',
	type: 'object',
	description: 'The user object.',
	properties: {
		uuid: {
			type: 'string',
			description: "The user's UUID.",
			example: '1453821d-aaf9-435c-8a51-e3f16f7d2ee5'
		},
		username: {
			type: 'string',
			description: "The user's username.",
			example: 'admin'
		},
		isAdmin: {
			type: 'boolean',
			description: 'Whether the user is an admin or not.',
			example: true
		},
		enabled: {
			type: 'boolean',
			description: "Whether the user's account is enabled or not.",
			example: true
		},
		createdAt: {
			type: 'string',
			description: "The user's creation date.",
			example: '2021-01-01T00:00:00.000Z'
		},
		editedAt: {
			type: 'string',
			description: "The user's last edit date.",
			example: '2021-01-01T00:00:00.000Z'
		}
	}
});

server.addSchema({
	$id: 'RequestUser',
	type: 'object',
	description: 'The user object.',
	properties: {
		uuid: {
			type: 'string',
			description: "The user's UUID.",
			example: '1453821d-aaf9-435c-8a51-e3f16f7d2ee5'
		},
		username: {
			type: 'string',
			description: "The user's username.",
			example: 'admin'
		},
		isAdmin: {
			type: 'boolean',
			description: 'Whether or not the user is an administrator.',
			example: true
		},
		apiKey: {
			type: 'string',
			description: "The user's API key.",
			example: 'a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6'
		},
		passwordEditedAt: {
			type: 'string',
			description: "The date and time the user's password was last edited.",
			example: '2021-01-01T00:00:00.000Z'
		}
	}
});

server.addSchema({
	$id: 'HTTP4xxError',
	type: 'object',
	description: 'An error response.',
	properties: {
		statusCode: {
			type: 'number',
			description: 'HTTP status code.',
			example: 401
		},
		error: {
			type: 'string',
			description: 'HTTP status description.',
			example: 'Unauthorized'
		},
		message: { $ref: 'ResponseMessage' }
	}
});

server.addSchema({
	$id: 'HTTP5xxError',
	type: 'object',
	description: 'An error response.',
	properties: {
		statusCode: {
			type: 'number',
			description: 'HTTP status code',
			example: 500
		},
		error: {
			type: 'string',
			description: 'HTTP status description',
			example: 'Internal Server Error'
		},
		message: { $ref: 'ResponseMessage' }
	}
});

server.addSchema({
	$id: 'ResponseMessage',
	type: 'string',
	description: 'A message describing the result of the request.'
});

server.addSchema({
	$id: 'QueryPage',
	type: 'number',
	description: 'The page number.',
	minimum: 1
});

server.addSchema({
	$id: 'QueryLimit',
	type: 'number',
	description: 'The amount of items per page.',
	minimum: 1,
	maximum: 500
});

void start();
