import type { FastifyReply } from 'fastify';
import { z } from 'zod';
import prisma from '@/structures/database.js';
import type { RequestWithUser } from '@/structures/interfaces.js';
import { http4xxErrorSchema } from '@/structures/schemas/HTTP4xxError.js';
import { http5xxErrorSchema } from '@/structures/schemas/HTTP5xxError.js';
import { responseMessageSchema } from '@/structures/schemas/ResponseMessage.js';

export const schema = {
	summary: 'Delete link',
	description: 'Deletes an album link',
	tags: ['Albums'],
	params: z
		.object({
			uuid: z.string().describe('The uuid of the album.'),
			linkUuid: z.string().describe('The uuid of the link.')
		})
		.required(),
	response: {
		200: z.object({
			message: responseMessageSchema
		}),
		'4xx': http4xxErrorSchema,
		'5xx': http5xxErrorSchema
	}
};

export const options = {
	url: '/album/:uuid/link/:linkUuid',
	method: 'delete',
	middlewares: ['apiKey', 'auth']
};

export const run = async (req: RequestWithUser, res: FastifyReply) => {
	const { uuid, linkUuid } = req.params as { linkUuid: string; uuid: string };

	const album = await prisma.albums.findFirst({
		where: {
			uuid,
			userId: req.user.id
		}
	});

	if (!album) {
		void res.badRequest("Album doesn't exist or doesn't belong to the user");
		return;
	}

	const link = await prisma.links.findFirst({
		where: {
			userId: req.user.id,
			albumId: album.id,
			uuid: linkUuid
		}
	});

	if (!link) {
		void res.notFound('No link found');
		return;
	}

	await prisma.links.delete({
		where: {
			uuid: linkUuid
		}
	});

	return res.send({
		message: 'Successfully deleted the link'
	});
};
