import type { FastifyRequest, FastifyReply } from 'fastify';
import process from 'node:process';
import path from 'node:path';
import jetpack from 'fs-jetpack';

export const options = {
	url: '/docs',
	method: 'get',
	ignoreRoutePrefix: true,
	schema: {
		hide: true
	}
};

const filePath =
	process.env.NODE_ENV === 'production'
		? path.join(__dirname, '..', '..', '..', 'src', 'docs', 'index.html')
		: path.join(__dirname, '..', '..', 'docs', 'index.html');
const docsHTML = jetpack.read(filePath, 'utf8');

export const run = (req: FastifyRequest, res: FastifyReply) => {
	void res.type('text/html').send(docsHTML);
};
