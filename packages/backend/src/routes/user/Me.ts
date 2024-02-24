import type { FastifyReply } from 'fastify';
import { z } from 'zod';
import type { RequestWithUser } from '@/structures/interfaces.js';
import { http4xxErrorSchema } from '@/structures/schemas/HTTP4xxError.js';
import { http5xxErrorSchema } from '@/structures/schemas/HTTP5xxError.js';
import { requestUserSchema } from '@/structures/schemas/RequestUser.js';
import { responseMessageSchema } from '@/structures/schemas/ResponseMessage.js';
import { storageQuotaSchema } from '@/structures/schemas/StorageQuota.js';
import { getUsedQuota } from '@/utils/User.js';

export const schema = {
	summary: 'Get own user',
	description: 'Return the current user',
	tags: ['User'],
	response: {
		200: z.object({
			message: responseMessageSchema,
			user: requestUserSchema,
			storageQuota: storageQuotaSchema
		}),
		'4xx': http4xxErrorSchema,
		'5xx': http5xxErrorSchema
	}
};

export const options = {
	url: '/user/me',
	method: 'get',
	middlewares: ['apiKey', 'auth']
};

export const run = async (req: RequestWithUser, res: FastifyReply) => {
	return res.send({
		message: 'Successfully retrieved user',
		user: req.user,
		storageQuota: await getUsedQuota(req.user.id)
	});
};
