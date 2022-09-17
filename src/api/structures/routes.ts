import jetpack from 'fs-jetpack';
import path from 'path';
import type { Server, Request, Response } from 'hyper-express';
import type { RouteOptions } from './interfaces';
import log from '../utils/Log';
import { addSpaces } from '../utils/Util';

const defaultMiddlewares = ['log', 'ban'];

export default {
	load: async (server: Server) => {
		/*
			While in development we only want to match routes written in TypeScript but for production
			we need to change it to javascript files since they will be compiled.
		*/
		const matching = `*.${process.env.NODE_ENV === 'production' ? 'j' : 't'}s`;

		for (const routeFile of await jetpack.findAsync(path.join(__dirname, '..', 'routes'), { matching })) {
			try {
				const slash = process.platform === 'win32' ? '\\' : '/';
				const replace = process.env.NODE_ENV === 'production' ? `dist${slash}` : `src${slash}api${slash}`;
				const route = await import(routeFile.replace(replace, `..${slash}`));
				const options: RouteOptions = route.options;

				if (!options.url || !options.method) {
					log.warn(`Found route without URL or METHOD - ${routeFile}`);
					continue;
				}

				options.url = `${route.options?.ignoreRoutePrefix ? '' : '/api'}${options.url}`;

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
						const importedMiddleware = await import(path.join(__dirname, '..', 'middlewares', middleware));
						middlewares.push(importedMiddleware.default);
					}
				}

				// Register the route in hyper-express
				// @ts-ignore
				server[options.method](
					options.url,
					{
						middlewares
					},
					(req: Request, res: Response) => route.run(req, res)
				);

				log.info(`Found route |${addSpaces(options.method.toUpperCase())} ${options.url}`);
			} catch (error) {
				// eslint-disable-next-line @typescript-eslint/restrict-template-expressions
				log.error(routeFile);
				log.error(error);
			}
		}
	}
};
