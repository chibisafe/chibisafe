import type { FastifyReply } from 'fastify';
import prisma from '@/structures/database';
import type { RequestWithUser } from '@/structures/interfaces';

export const options = {
	url: '/tags',
	method: 'get',
	middlewares: ['apiKey', 'auth']
};

export const run = async (req: RequestWithUser, res: FastifyReply) => {
	const tags = await prisma.tags.findMany({
		where: {
			userId: req.user.id
		}
	});

	return res.send({
		message: 'Successfully fetched tags',
		data: tags
	});
};

export const schema = {
	description: 'Return a list of tags belonging to the user.',
	tags: ['Tags', 'API Key'],
	response: {
		200: {
			type: 'object',
			properties: {
				message: {
					type: 'string',
					description: 'A message describing the result of the request.'
				},
				data: {
					type: 'array',
					description: 'An array of tags belonging to the user.',
					items: {
						type: 'object',
						properties: {
							id: {
								type: 'number',
								description: 'The ID of the tag.',
								example: 1
							},
							uuid: {
								type: 'string',
								description: 'The UUID of the tag.',
								example: '1453821d-aaf9-435c-8a51-e3f16f7d2ee5'
							},
							userId: {
								type: 'number',
								description: 'The ID of the user that owns the tag.',
								example: 1
							},
							name: {
								type: 'string',
								description: 'The name of the tag.',
								example: 'Good Stuff'
							},
							createdAt: {
								type: 'string',
								description: 'The date the tag was created.',
								example: '2021-01-01T00:00:00.000Z'
							},
							editedAt: {
								type: 'string',
								description: 'The date the tag was last edited.',
								example: '2021-01-01T00:00:00.000Z'
							},
							files: {
								type: 'array',
								description: 'An array of files belonging to the tag.',
								items: {
									// TODO: Add file schema
									type: 'object'
								}
							}
						}
					}
				}
			}
		},
		'4xx': { $ref: 'HTTP4xxError' },
		'5xx': { $ref: 'HTTP5xxError' }
	}
};
