import type { FastifyReply } from 'fastify';
import type { RequestWithUser } from '../../../../structures/interfaces';
import { getConfig } from '../../../../utils/Util';

export const middlewares = ['auth', 'admin'];

export const run = async (req: RequestWithUser, res: FastifyReply) => res.send({
	message: 'Successfully retrieved config',
	config: (await getConfig())
});
