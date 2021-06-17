import { Application, Request, Response } from 'express';
import jetpack from 'fs-jetpack';
import path from 'path';

export default {
	load: async (server: Application) => {
		// eslint-disable-next-line @typescript-eslint/no-misused-promises
		for (const routeFile of await jetpack.findAsync(path.join(__dirname, '..', 'routes'), { matching: '*.{ts,js}' })) {
			try {
				const slash = process.platform === 'win32' ? '\\' : '/';
				const replace = process.env.NODE_ENV === 'production' ? `dist${slash}` : `src${slash}`;
				const route = await import(routeFile.replace(replace, `..${slash}`));
				const paths: Array<string> = routeFile.split(slash);
				const method = paths[paths.length - 1].split('.')[0];

				// Get rid of the filename
				paths.pop();

				// Get rid of the src/routes part
				paths.splice(0, 2);

				let routePath: string = paths.join(slash);

				// Transform path variables to express variables
				routePath = routePath.replace('_', ':');

				// Append the missing /
				routePath = `/${routePath}`;

				// Build final route
				const prefix = route.options?.ignoreRoutePrefix ? '' : process.env.routePrefix ?? '';
				routePath = `${prefix}${routePath}`;

				// Run middlewares if any
				const middlewares: any[] = [];
				if (route.middlewares?.length) {
					// eslint-disable-next-line @typescript-eslint/no-misused-promises
					for (const middlewareFile of await jetpack.findAsync(path.join(__dirname, '..', 'middlewares'), { matching: '*.{ts,js}' })) {
						const middleware = await import(middlewareFile.replace(replace, `..${slash}`));
						middlewares.push(middleware.default);
					}
				}

				// Register the route in Express
				(server as any)[method](routePath, ...middlewares, (req: Request, res: Response) => route.run(req, res));
				console.log(`Found route ${method.toUpperCase()} ${routePath}`);
			} catch (error) {
				// eslint-disable-next-line @typescript-eslint/restrict-template-expressions
				console.log(`${routeFile} :: ERROR`);
				console.log(error);
			}
		}
	}
};
