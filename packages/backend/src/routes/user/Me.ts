import type { FastifyReply } from 'fastify';
import type { RequestWithUser } from '@/structures/interfaces.js';
import { getUsedQuota } from '@/utils/User.js';

export const options = {
	url: '/user/me',
	method: 'get',
	middlewares: ['apiKey', 'auth']
};

export const run = async (req: RequestWithUser, res: FastifyReply) => {
	return res.send({
		message: 'Successfully retrieved user',
		user: req.user,
		storageQuota: await getUsedQuota(req.user.id)
	});
};
