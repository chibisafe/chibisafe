import type { FastifyReply } from 'fastify';
import type { RequestWithUser } from '../../structures/interfaces';
import prisma from '../../structures/database';
import { utc } from 'moment';
import randomstring from 'randomstring';

export const options = {
	url: '/auth/apikey/change',
	method: 'post',
	middlewares: ['auth']
};

export const run = async (req: RequestWithUser, res: FastifyReply) => {
	const now = utc().toDate();
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
