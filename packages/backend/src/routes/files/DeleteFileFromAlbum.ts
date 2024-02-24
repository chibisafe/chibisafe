import type { FastifyReply } from 'fastify';
import { z } from 'zod';
import prisma from '@/structures/database.js';
import type { RequestWithUser } from '@/structures/interfaces.js';
import { http4xxErrorSchema } from '@/structures/schemas/HTTP4xxError.js';
import { http5xxErrorSchema } from '@/structures/schemas/HTTP5xxError.js';
import { responseMessageSchema } from '@/structures/schemas/ResponseMessage.js';

export const schema = {
	summary: 'Delete file from album',
	description: 'Deletes a file from an album',
	tags: ['Files', 'Albums'],
	params: z
		.object({
			uuid: z.string().describe('The uuid of the file.'),
			albumUuid: z.string().describe('The uuid of the album.')
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
	url: '/file/:uuid/album/:albumUuid',
	method: 'delete',
	middlewares: ['apiKey', 'auth']
};

export const run = async (req: RequestWithUser, res: FastifyReply) => {
	const { uuid, albumUuid } = req.params as { albumUuid: string; uuid: string };

	const fileExists = await prisma.files.findFirst({
		where: {
			uuid,
			userId: req.user.id
		}
	});

	if (!fileExists) {
		void res.notFound("File doesn't exist or doesn't belong to the user");
		return;
	}

	const albumExists = await prisma.albums.findFirst({
		where: {
			uuid: albumUuid,
			userId: req.user.id
		}
	});

	if (!albumExists) {
		void res.notFound("Album doesn't exist or doesn't belong to the user");
		return;
	}

	await prisma.files.update({
		where: {
			id: fileExists.id
		},
		data: {
			albums: {
				disconnect: {
					id: albumExists.id
				}
			}
		}
	});

	return res.send({
		message: 'Successfully deleted file from album'
	});
};
