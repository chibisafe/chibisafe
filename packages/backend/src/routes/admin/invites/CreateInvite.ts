import type { FastifyReply } from 'fastify';
import { v4 as uuidv4 } from 'uuid';
import prisma from '@/structures/database.js';
import type { RequestWithUser } from '@/structures/interfaces.js';

export const options = {
	url: '/admin/invite/create',
	method: 'post',
	middlewares: ['apiKey', 'auth', 'admin']
};

export const run = async (req: RequestWithUser, res: FastifyReply) => {
	const code = uuidv4();
	await prisma.invites.create({
		data: {
			code,
			createdBy: req.user.uuid
		}
	});

	return res.send({
		message: 'Successfully created invite',
		code
	});
};
