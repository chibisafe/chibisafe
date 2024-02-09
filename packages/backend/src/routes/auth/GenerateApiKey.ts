import type { FastifyReply } from 'fastify';
import moment from 'moment';
import randomstring from 'randomstring';
import { z } from 'zod';
import prisma from '@/structures/database.js';
import type { RequestWithUser } from '@/structures/interfaces.js';
import { http4xxErrorSchema } from '@/structures/schemas/HTTP4xxError.js';
import { http5xxErrorSchema } from '@/structures/schemas/HTTP5xxError.js';
import { requestUserSchema } from '@/structures/schemas/RequestUser.js';
import { responseMessageSchema } from '@/structures/schemas/ResponseMessage.js';

export const schema = {
	summary: 'Generate API key',
	description: 'Generate a new API key for the current user',
	tags: ['Auth'],
	response: {
		200: z.object({
			message: responseMessageSchema,
			apiKey: requestUserSchema.shape.apiKey
		}),
		'4xx': http4xxErrorSchema,
		'5xx': http5xxErrorSchema
	}
};

export const options = {
	url: '/auth/apikey/change',
	method: 'post',
	middlewares: ['auth']
};

export const run = async (req: RequestWithUser, res: FastifyReply) => {
	const now = moment.utc().toDate();
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
