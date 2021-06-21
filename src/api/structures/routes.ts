import type { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import jetpack from 'fs-jetpack';
import path from 'path';

export default {
	load: async (server: FastifyInstance) => {
		/*
			While in development we only want to match routes written in TypeScript but for production
			we need to change it to javascript files since they will be compiled.
			TODO: Would running the TypeScript files directly with something like ts-node be a good move?
		*/

		const matching = `*.${process.env.NODE_ENV === 'production' ? 'j' : 't'}s`;
		for (const routeFile of await jetpack.findAsync(path.join(__dirname, '..', 'routes'), { matching })) {
			try {
				const slash = process.platform === 'win32' ? '\\' : '/';
				const replace = process.env.NODE_ENV === 'production' ? `dist${slash}` : `src${slash}api${slash}`;
				const route = await import(routeFile.replace(replace, `..${slash}`));
				const paths: Array<string> = routeFile.split(slash);
				const method = paths[paths.length - 1].split('.')[0];

				// Get rid of the filename
				paths.pop();

				// Get rid of the src/api/routes part
				paths.splice(0, 3);

				let url: string = paths.join(slash);

				// Transform path variables to express variables
				url = url.replace('_', ':');

				// Append the missing /
				url = `/${url}`;

				// Build final route
				url = `${route.options?.ignoreRoutePrefix ? '' : '/api'}${url}`;

				// Run middlewares if any, and in order of execution
				const middlewares: any[] = [];
				if (route.middlewares?.length) {
					// Set default middlewares that need to be included
					route.middlewares.unshift('ban');
					// Load the middlewares defined in the route file
					for (const middleware of route.middlewares) {
						const importedMiddleware = await import(path.join(__dirname, '..', 'middlewares', middleware));
						middlewares.push(importedMiddleware.default);
					}
				}

				// Register the route in Fastify
				server.route({
					method: method.toUpperCase() as any,
					url,
					preHandler: middlewares,
					handler: (req: FastifyRequest, res: FastifyReply) => route.run(req, res)
				});

				server.log.info(`Found route ${method.toUpperCase()} ${url}`);
			} catch (error) {
				// eslint-disable-next-line @typescript-eslint/restrict-template-expressions
				server.log.error(`${routeFile} :: ERROR`);
				server.log.error(error);
			}
		}
	}
};
