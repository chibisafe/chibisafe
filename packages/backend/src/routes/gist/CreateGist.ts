import type { FastifyReply } from 'fastify';
import prisma from '@/structures/database';
import type { RequestWithUser } from '@/structures/interfaces';
import { v4 as uuidv4 } from 'uuid';
import { utc } from 'moment';
import { constructGistPublicLink, getUniqueGistIdentifier } from '@/utils/Gist';

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
	const uniqueIdentifier = await getUniqueGistIdentifier();
	if (!uniqueIdentifier) {
		res.internalServerError('Couldnt allocate identifier for gist');
		return;
	}

	const gist = await prisma.gists.create({
		data: {
			name,
			content,
			language,
			identifier: uniqueIdentifier,
			parentUuid: null,
			userId: req.user?.id,
			uuid: uuidv4(),
			createdAt: now,
			editedAt: now
		}
	});

	const publicLink = constructGistPublicLink(req, uniqueIdentifier);

	return res.send({
		message: 'Successfully created gist',
		gist: {
			uuid: gist.uuid,
			...publicLink
		}
	});
};
