import type { FastifyReply } from 'fastify';
import prisma from '@/structures/database';
import type { RequestWithUser } from '@/structures/interfaces';
import { v4 as uuidv4 } from 'uuid';
import { utc } from 'moment';

export const options = {
	url: '/gist/create',
	method: 'post',
	middlewares: [
		{
			name: 'apiKey'
		},
		{
			name: 'auth',
			optional: true
		}
	]
};

export const run = async (req: RequestWithUser, res: FastifyReply) => {
	const { name, content, language } = req.body as { name: string; content: string; language: string };

	const now = utc().toDate();
	const gist = await prisma.gists.create({
		data: {
			name,
			content,
			language,
			parentUuid: null,
			userId: req.user?.id,
			uuid: uuidv4(),
			createdAt: now,
			editedAt: now
		}
	});

	return res.send({
		message: 'Successfully created gist',
		gist: {
			uuid: gist.uuid
		}
	});
};
