import type { FastifyRequest, FastifyReply } from 'fastify';
import { purgePublicFiles } from '@/utils/File.js';

export const options = {
	url: '/admin/files/purge/public',
	method: 'post',
	middlewares: ['apiKey', 'auth', 'admin']
};

export const run = async (_: FastifyRequest, res: FastifyReply) => {
	await purgePublicFiles();

	return res.send({
		message: "Successfully purged user's files and albums"
	});
};
