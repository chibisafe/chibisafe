import type { FastifyRequest, FastifyReply } from 'fastify';
import { purgeIpFiles } from '@/utils/File';

export const options = {
	url: '/admin/ip/files/purge',
	method: 'post',
	middlewares: ['auth', 'admin']
};

export const run = async (req: FastifyRequest, res: FastifyReply) => {
	const { ip }: { ip: string } = req.body as { ip: string };
	if (!ip) return res.code(400).send({ message: 'No ip provided' });

	await purgeIpFiles(ip);

	return res.send({
		message: "Successfully purged IP's files"
	});
};
