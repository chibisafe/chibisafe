import type { FastifyReply } from 'fastify';
import type { RequestWithUser } from '@/structures/interfaces';
import { updateCheck } from '@/utils/UpdateCheck';

export const options = {
	url: '/admin/service/updateCheck',
	method: 'get',
	middlewares: ['auth', 'admin']
};

export const run = async (req: RequestWithUser, res: FastifyReply) => {
	return res.send(updateCheck);
};
