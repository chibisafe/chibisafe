import jetpack from 'fs-jetpack';
import path from 'path';
import type { Server, Request, Response } from 'hyper-express';
import log from '../utils/Log';

const defaultMiddlewares = ['ban'];

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
				if (!route.url || !route.method) {
					log.warn(`Found route without URL or METHOD - ${routeFile}`);
					continue;
				}

				// Run middlewares if any, and in order of execution
				const middlewares: any[] = [];

				// Set default middlewares that need to be included
				for (const middleware of defaultMiddlewares) {
					const importedMiddleware = await import(path.join(__dirname, '..', 'middlewares', middleware));
					middlewares.push(importedMiddleware.default);
				}

				// Now load the middlewares defined in the route file
				if (route.middlewares?.length) {
					for (const middleware of route.middlewares) {
						const importedMiddleware = await import(path.join(__dirname, '..', 'middlewares', middleware));
						middlewares.push(importedMiddleware.default);
					}
				}

				// Register the route in hyper-express
				// FIXME: server[route.method] doesn't seem to work so I'm doing server.get/post/put/delete for now

				if (route.method === 'GET')
					server.get(
						route.url,
						{
							middlewares
						},
						(req: Request, res: Response) => route.run(req, res)
					);
				else if (route.method === 'POST')
					server.post(
						route.url,
						{
							middlewares
						},
						(req: Request, res: Response) => route.run(req, res)
					);
				else if (route.method === 'DELETE')
					server.delete(
						route.url,
						{
							middlewares
						},
						(req: Request, res: Response) => route.run(req, res)
					);

				log.info(`Found route ${route.method.toUpperCase() as string} ${route.url as string}`);
			} catch (error) {
				// eslint-disable-next-line @typescript-eslint/restrict-template-expressions
				log.error(routeFile);
				log.error(error);
			}
		}
	}
};
