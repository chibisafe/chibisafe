import type { FastifyReply } from 'fastify';
import moment from 'moment';
import randomstring from 'randomstring';
import prisma from '@/structures/database.js';
import type { RequestWithUser } from '@/structures/interfaces.js';

export const options = {
	url: '/auth/apikey/change',
	method: 'post',
	middlewares: ['auth']
};

export const run = async (req: RequestWithUser, res: FastifyReply) => {
	const now = moment.utc().toDate();
	const apiKey = randomstring.generate(64);

	await prisma.users.update({
		where: {
			id: req.user.id
		},
		data: {
			apiKey,
			apiKeyEditedAt: now
		}
	});

	return res.send({
		message: 'Successfully created new api key',
		apiKey
	});
};
