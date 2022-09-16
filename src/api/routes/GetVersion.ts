import type { Request, Response } from 'hyper-express';

export const options = {
	url: '/version',
	method: 'get'
};

export const run = (req: Request, res: Response) => {
	res.json({
		version: process.env.npm_package_version
	});
};
