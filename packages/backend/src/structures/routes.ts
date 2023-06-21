import jetpack from 'fs-jetpack';
import path from 'node:path';
import { inspect } from 'node:util';
import process from 'node:process';
import type { FastifyInstance, FastifyRequest, FastifyReply, HookHandlerDoneFunction } from 'fastify';
import type { RouteOptions } from './interfaces';
import { addSpaces } from '@/utils/Util';
import { SETTINGS } from './settings';

const defaultMiddlewares = ['log', 'ban'];

export default {
	load: async (server: FastifyInstance) => {
		/*
			While in development we only want to match routes written in TypeScript but for production
			we need to change it to javascript files since they will be compiled.
		*/
		const matching = `*.${process.env.NODE_ENV === 'production' ? 'j' : 't'}s`;

		for (const routeFile of await jetpack.findAsync(path.join(__dirname, '..', 'routes'), { matching })) {
			try {
				const slash = process.platform === 'win32' ? '\\' : '/';
				const replace = process.env.NODE_ENV === 'production' ? `dist${slash}` : `src${slash}`;
				const route = await import(routeFile.replace(replace, `..${slash}`));
				const options: RouteOptions = route.options;

				if (!options.url || !options.method) {
					server.log.warn(`Found route without URL or METHOD - ${routeFile}`);
					continue;
				}

				options.url = `${route.options?.ignoreRoutePrefix ? '' : '/api'}${options.url}`;

				// Init empty route's options object, if applicable
				if (!options.options) {
					options.options = {};
				}

				// Run middlewares if any, and in order of execution
				const middlewares: any[] = [];

				// Set default middlewares that need to be included
				for (const middleware of defaultMiddlewares) {
					const importedMiddleware = await import(path.join(__dirname, '..', 'middlewares', middleware));
					middlewares.push(importedMiddleware.default);
				}

				// Now load the middlewares defined in the route file
				if (options.middlewares?.length) {
					for (const middleware of options.middlewares) {
						let name: string | unknown | undefined;
						let middlewareOptions: { [index: number | string]: any } | undefined;

						if (typeof middleware === 'string') {
							name = middleware;
						} else if (typeof middleware === 'object') {
							name = middleware.name;
							// Create a shallow copy of the middleware object, containing all properties but "name"
							middlewareOptions = { ...middleware };
							delete middlewareOptions.name;
						}

						// Assert that middleware name is a valid string
						if (!name || typeof name !== 'string') {
							server.log.error(`Invalid middleware options in route ${options.method} ${options.url}`);
							continue;
						}

						const importedMiddleware = await import(path.join(__dirname, '..', 'middlewares', name));

						// Init anonymous function, to pass middleware options to the middleware on run, if applicable
						if (middlewareOptions) {
							middlewares.push((req: FastifyRequest, res: FastifyReply, next: HookHandlerDoneFunction) =>
								importedMiddleware.default(req, res, next, middlewareOptions)
							);
						} else {
							middlewares.push(importedMiddleware.default);
						}
					}
				}

				// Insert built middlewares array into route's options object
				if (options.debug) {
					server.log.debug(inspect(options));
				}

				// Register the route in fastify
				server.route({
					method: options.method.toUpperCase() as any,
					url: options.url,
					preHandler: middlewares,
					handler: (req: FastifyRequest, res: FastifyReply) => route.run(req, res),
					config: {
						rateLimit: {
							max: options.options?.rateLimit?.max ?? SETTINGS.rateLimitMax,
							timeWindow: options.options?.rateLimit?.timeWindow ?? SETTINGS.rateLimitWindow
						}
					}
				});

				server.log.debug(`Found route |${addSpaces(options.method.toUpperCase())} ${options.url}`);
			} catch (error) {
				// eslint-disable-next-line @typescript-eslint/restrict-template-expressions
				server.log.error(routeFile);
				server.log.error(error);
			}
		}
	}
};
