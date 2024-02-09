import type { FastifyReply } from 'fastify';
import { z } from 'zod';
import prisma from '@/structures/database.js';
import type { RequestWithUser } from '@/structures/interfaces.js';
import { http4xxErrorSchema } from '@/structures/schemas/HTTP4xxError.js';
import { http5xxErrorSchema } from '@/structures/schemas/HTTP5xxError.js';
import { responseMessageSchema } from '@/structures/schemas/ResponseMessage.js';

export const schema = {
	summary: 'Get links',
	description: 'Gets all existing album links',
	tags: ['Albums'],
	params: z
		.object({
			uuid: z.string().describe('The uuid of the album.')
		})
		.required(),
	response: {
		200: z.object({
			message: responseMessageSchema,
			links: z.array(
				z.object({
					identifier: z.string().describe('The identifier of the link'),
					uuid: z.string().describe('The uuid of the link'),
					enabled: z.boolean().describe('Whether the link is enabled'),
					enableDownload: z.boolean().describe('Whether the link allows downloads'),
					expiresAt: z.date().nullable().describe('The expiration date of the link'),
					views: z.number().describe('The amount of views the link has'),
					createdAt: z.date().describe('The creation date of the link'),
					editedAt: z.date().nullable().describe('The last edit date of the link')
				})
			)
		}),
		'4xx': http4xxErrorSchema,
		'5xx': http5xxErrorSchema
	}
};

export const options = {
	url: '/album/:uuid/links',
	method: 'get',
	middlewares: ['apiKey', 'auth']
};

export const run = async (req: RequestWithUser, res: FastifyReply) => {
	const { uuid } = req.params as { uuid: string };
	if (!uuid) {
		void res.badRequest('Invalid uuid supplied');
		return;
	}

	const album = await prisma.albums.findFirst({
		where: {
			uuid,
			userId: req.user.id
		},
		select: {
			id: true
		}
	});

	if (!album) {
		void res.badRequest("Album doesn't exist or doesn't belong to the user");
		return;
	}

	const links = await prisma.links.findMany({
		where: {
			albumId: album.id,
			userId: req.user.id
		},
		select: {
			uuid: true,
			identifier: true,
			views: true,
			enabled: true,
			enableDownload: true,
			expiresAt: true,
			createdAt: true,
			editedAt: true
		}
	});

	return res.send({
		message: 'Successfully retrieved links',
		links
	});
};
