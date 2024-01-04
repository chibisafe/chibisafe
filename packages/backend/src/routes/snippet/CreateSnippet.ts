import type { FastifyReply } from 'fastify';
import moment from 'moment';
import { v4 as uuidv4 } from 'uuid';
import prisma from '@/structures/database.js';
import type { RequestWithUser } from '@/structures/interfaces.js';
import { constructSnippetPublicLink, getUniqueSnippetIdentifier } from '@/utils/Snippet.js';

export const options = {
	url: '/snippet/create',
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
	const { name, content, language } = req.body as { content: string; language: string; name: string };

	const now = moment.utc().toDate();
	const uniqueIdentifier = await getUniqueSnippetIdentifier();
	if (!uniqueIdentifier) {
		void res.internalServerError('Couldnt allocate identifier for snippet');
		return;
	}

	const snippet = await prisma.snippets.create({
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

	const publicLink = constructSnippetPublicLink(req, uniqueIdentifier);

	return res.send({
		message: 'Successfully created snippet',
		snippet: {
			uuid: snippet.uuid,
			...publicLink
		}
	});
};
