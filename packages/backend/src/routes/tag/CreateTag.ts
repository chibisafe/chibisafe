import type { FastifyReply } from 'fastify';
import prisma from '@/structures/database';
import type { RequestWithUser } from '@/structures/interfaces';
import { v4 as uuidv4 } from 'uuid';
import { utc } from 'moment';

export const options = {
	url: '/tag/create',
	method: 'post',
	middlewares: ['apiKey', 'auth']
};

export const run = async (req: RequestWithUser, res: FastifyReply) => {
	const { name } = req.body as { name?: string };
	if (!name) return res.code(400).send({ message: 'No name provided' });

	const exists = await prisma.tags.findFirst({
		where: {
			name,
			userId: req.user.id
		}
	});

	if (exists) return res.code(400).send({ message: "There's already a tag with that name" });

	const now = utc().toDate();
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
		data: {
			uuid: newTag.uuid,
			name: newTag.name,
			createdAt: newTag.createdAt
		}
	});
};

export const schema = {
	description: 'Create a new tag.',
	tags: ['Tags', 'API Key'],
	body: {
		type: 'object',
		properties: {
			name: {
				type: 'string',
				description: 'The name of the tag.'
			}
		},
		required: ['name']
	},
	response: {
		200: {
			type: 'object',
			properties: {
				message: {
					type: 'string',
					description: 'A message describing the result of the request.'
				},
				data: {
					type: 'object',
					properties: {
						uuid: {
							type: 'string',
							description: 'The uuid of the tag.',
							example: '1453821d-aaf9-435c-8a51-e3f16f7d2ee5'
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
						}
					}
				}
			}
		},
		'4xx': { $ref: 'HTTP4xxError' },
		'5xx': { $ref: 'HTTP5xxError' }
	}
};
