import type { FastifyReply } from 'fastify';
import moment from 'moment';
import { v4 as uuidv4 } from 'uuid';
import { z } from 'zod';
import prisma from '@/structures/database.js';
import type { RequestWithUser } from '@/structures/interfaces.js';
import { http4xxErrorSchema } from '@/structures/schemas/HTTP4xxError.js';
import { http5xxErrorSchema } from '@/structures/schemas/HTTP5xxError.js';
import { responseMessageSchema } from '@/structures/schemas/ResponseMessage.js';

export const schema = {
	summary: 'Create tag',
	description: 'Create a new tag',
	tags: ['Tags'],
	body: z
		.object({
			name: z.string().describe('The name of the tag.')
		})
		.required(),
	response: {
		200: z.object({
			message: responseMessageSchema,
			tag: z.object({
				uuid: z.string().describe('The uuid of the tag.'),
				name: z.string().describe('The name of the tag.'),
				createdAt: z.date().describe('The date the tag was created.')
			})
		}),
		'4xx': http4xxErrorSchema,
		'5xx': http5xxErrorSchema
	}
};

export const options = {
	url: '/tag/create',
	method: 'post',
	middlewares: ['apiKey', 'auth']
};

export const run = async (req: RequestWithUser, res: FastifyReply) => {
	const { name } = req.body as { name: string };

	const exists = await prisma.tags.findFirst({
		where: {
			name,
			userId: req.user.id
		}
	});

	if (exists) {
		void res.badRequest("There's already a tag with that name");
		return;
	}

	const now = moment.utc().toDate();
	const newTag = await prisma.tags.create({
		data: {
			name,
			userId: req.user.id,
			uuid: uuidv4(),
			createdAt: now,
			editedAt: now
		}
	});

	return res.send({
		message: 'Successfully created tag',
		tag: {
			uuid: newTag.uuid,
			name: newTag.name,
			createdAt: newTag.createdAt
		}
	});
};
