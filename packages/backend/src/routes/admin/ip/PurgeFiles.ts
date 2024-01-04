import type { FastifyRequest, FastifyReply } from 'fastify';
import { purgeIpFiles } from '@/utils/File.js';

export const options = {
	url: '/admin/ip/files/purge',
	method: 'post',
	middlewares: ['apiKey', 'auth', 'admin']
};

export const run = async (req: FastifyRequest, res: FastifyReply) => {
	const { ip }: { ip: string } = req.body as { ip: string };
	if (!ip) {
		void res.badRequest('No ip provided');
		return;
	}

	await purgeIpFiles(ip);

	return res.send({
		message: "Successfully purged IP's files"
	});
};
