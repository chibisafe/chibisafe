import type { Response } from 'hyper-express';

export const url = '/version';
export const method = 'GET';

export const run = (res: Response) => {
	res.json({
		version: process.env.npm_package_version
	});
};
