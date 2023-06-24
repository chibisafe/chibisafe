import type { FastifyReply } from 'fastify';
import type { RequestWithUser } from '@/structures/interfaces';

export const options = {
	url: '/user/me',
	method: 'get',
	middlewares: ['apiKey', 'auth']
};

export const run = (req: RequestWithUser, res: FastifyReply) => {
	return res.send({
		message: 'Successfully retrieved user',
		user: req.user
	});
};

export const schema = {
	description: 'Return the current user.',
	tags: ['User', 'API Key'],
	response: {
		200: {
			type: 'object',
			properties: {
				message: {
					type: 'string',
					description: 'A message describing the result of the request.'
				},
				user: { $ref: 'RequestUser' }
			}
		},
		'4xx': { $ref: 'HTTP4xxError' },
		'5xx': { $ref: 'HTTP5xxError' }
	}
};
