import type { Request, Response } from 'hyper-express';
import jetpack from 'fs-jetpack';
import path from 'node:path';
import log from '../utils/Log';

const ignorePaths = ['/favicon.ico', '/robots.txt', '/sitemap.xml'];

export default async (req: Request, res: Response) => {
	if (ignorePaths.includes(req.path)) return res.status(404).send('Not found');
	log.debug(`Requesting file: ${req.path}`);

	const fullPath = path.join(__dirname, '..', '..', '..', 'uploads', req.path);
	const exists = await jetpack.inspectAsync(fullPath);
	if (!exists || exists.type !== 'file') return res.status(404).send('Not found');

	if (req.method === 'HEAD') {
		res.header('Content-Length', String(exists.size));
		return res.end();
	}

	const readStream = jetpack.createReadStream(fullPath);
	readStream.on('error', error => {
		readStream.destroy();
		log.error(error);
	});

	res.stream(readStream, exists.size);
};
