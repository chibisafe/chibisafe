import type { FastifyReply } from 'fastify';
import prisma from '@/structures/database.js';
import type { RequestWithUser } from '@/structures/interfaces.js';
import { http4xxErrorSchema } from '@/structures/schemas/HTTP4xxError.js';
import { http5xxErrorSchema } from '@/structures/schemas/HTTP5xxError.js';
import { SETTINGS } from '@/structures/settings.js';

export const schema = {
	summary: 'Increase link view count',
	description: 'Increases the number of times a link was viewed',
	tags: ['Links'],
	response: {
		'4xx': http4xxErrorSchema,
		'5xx': http5xxErrorSchema
	}
};

export const options = {
	url: '/link/:identifier/count',
	method: 'get'
};

export const run = async (req: RequestWithUser, res: FastifyReply) => {
	if (!SETTINGS.useUrlShortener) {
		void res.notImplemented('URL shortener is disabled');
		return;
	}

	const { identifier } = req.params as { identifier: string };

	try {
		await prisma.shortenedLinks.update({
			where: {
				identifier
			},
			data: {
				views: {
					increment: 1
				}
			}
		});
	} catch (error: any) {
		void res.internalServerError(error);
		return;
	}

	return res.send({
		message: 'Successfully updated count'
	});
};
