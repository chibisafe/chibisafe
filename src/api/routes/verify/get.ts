import type { FastifyReply } from 'fastify';
import { RequestWithUser } from '../../structures/interfaces';

export const middlewares = ['auth'];

export const run = (req: RequestWithUser, res: FastifyReply) => res.status(200).send(req.user);
