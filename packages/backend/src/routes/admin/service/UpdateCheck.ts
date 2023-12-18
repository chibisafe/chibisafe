import type { FastifyReply } from 'fastify';
import type { RequestWithUser } from '@/structures/interfaces.js';
import { updateCheck } from '@/utils/UpdateCheck.js';

export const options = {
	url: '/admin/service/updateCheck',
	method: 'get',
	middlewares: ['apiKey', 'auth', 'admin']
};

export const run = async (_: RequestWithUser, res: FastifyReply) => {
	return res.send(updateCheck);
};
