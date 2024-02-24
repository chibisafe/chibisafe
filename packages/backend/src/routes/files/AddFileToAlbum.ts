import type { FastifyReply } from 'fastify';
import { z } from 'zod';
import prisma from '@/structures/database.js';
import type { RequestWithUser } from '@/structures/interfaces.js';
import { http4xxErrorSchema } from '@/structures/schemas/HTTP4xxError.js';
import { http5xxErrorSchema } from '@/structures/schemas/HTTP5xxError.js';
import { responseMessageSchema } from '@/structures/schemas/ResponseMessage.js';
import { saveFileToAlbum } from '@/utils/File.js';

export const schema = {
	summary: 'Add file to album',
	description: 'Adds a file to an album',
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
	method: 'post',
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
		},
		select: {
			id: true
		}
	});

	if (!albumExists) {
		void res.notFound("Album doesn't exist or doesn't belong to the user");
		return;
	}

	await saveFileToAlbum(albumExists.id, fileExists.id);

	return res.send({
		message: 'Successfully added file to album'
	});
};
