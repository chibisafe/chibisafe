import type { FastifyRequest, FastifyReply } from 'fastify';
import { purgePublicFiles } from '@/utils/File';

export const options = {
	url: '/admin/files/purge/public',
	method: 'post',
	middlewares: ['auth', 'admin']
};

export const run = async (req: FastifyRequest, res: FastifyReply) => {
	await purgePublicFiles();

	return res.send({
		message: "Successfully purged user's files and albums"
	});
};
