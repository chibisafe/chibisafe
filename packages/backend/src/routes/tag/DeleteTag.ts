import type { FastifyReply } from 'fastify';
import prisma from '@/structures/database';
import type { RequestWithUser } from '@/structures/interfaces';

export const options = {
	url: '/tag/:uuid',
	method: 'delete',
	middlewares: ['apiKey', 'auth']
};

export const run = async (req: RequestWithUser, res: FastifyReply) => {
	const { uuid } = req.params as { uuid?: string };
	if (!uuid) return res.code(400).send({ message: 'No uuid provided' });

	const tag = await prisma.tags.findFirst({
		where: {
			userId: req.user.id,
			uuid
		}
	});

	if (!tag) return res.code(400).send({ message: "The tag doesn't exist or doesn't belong to the user" });

	await prisma.tags.delete({
		where: {
			uuid
		}
	});

	return res.send({
		message: 'Successfully deleted the tag'
	});
};

export const schema = {
	description: 'Delete a tag.',
	tags: ['Tags', 'API Key'],
	params: {
		type: 'object',
		properties: {
			uuid: {
				type: 'string',
				description: 'The uuid of the tag.'
			}
		},
		required: ['uuid']
	},
	response: {
		200: {
			type: 'object',
			properties: {
				message: {
					type: 'string',
					description: 'A message describing the result of the request.'
				}
			}
		},
		'4xx': { $ref: 'HTTP4xxError' },
		'5xx': { $ref: 'HTTP5xxError' }
	}
};
