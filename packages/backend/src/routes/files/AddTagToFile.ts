import type { FastifyReply } from 'fastify';
import { z } from 'zod';
import prisma from '@/structures/database.js';
import type { RequestWithUser } from '@/structures/interfaces.js';
import { http4xxErrorSchema } from '@/structures/schemas/HTTP4xxError.js';
import { http5xxErrorSchema } from '@/structures/schemas/HTTP5xxError.js';
import { responseMessageSchema } from '@/structures/schemas/ResponseMessage.js';

export const schema = {
	summary: 'Add tag to file',
	description: 'Adds a tag to a file',
	tags: ['Files', 'Tags'],
	params: z
		.object({
			uuid: z.string().describe('The uuid of the file.'),
			tagUuid: z.string().describe('The uuid of the tag.')
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
	url: '/file/:uuid/tag/:tagUuid',
	method: 'post',
	middlewares: ['apiKey', 'auth']
};

export const run = async (req: RequestWithUser, res: FastifyReply) => {
	const { uuid, tagUuid } = req.params as { tagUuid: string; uuid: string };

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

	const tagExists = await prisma.tags.findFirst({
		where: {
			uuid: tagUuid,
			userId: req.user.id
		},
		select: {
			id: true
		}
	});

	if (!tagExists) {
		void res.notFound("Tag doesn't exist or doesn't belong to the user");
		return;
	}

	await prisma.files.update({
		where: {
			id: fileExists.id
		},
		data: {
			tags: {
				connect: {
					id: tagExists.id
				}
			}
		}
	});

	return res.send({
		message: 'Successfully added tag to file'
	});
};
