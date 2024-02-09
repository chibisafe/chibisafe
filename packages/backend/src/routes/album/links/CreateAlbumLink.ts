import type { FastifyReply } from 'fastify';
import { v4 as uuidv4 } from 'uuid';
import { z } from 'zod';
import prisma from '@/structures/database.js';
import type { RequestWithUser } from '@/structures/interfaces.js';
import { http4xxErrorSchema } from '@/structures/schemas/HTTP4xxError.js';
import { http5xxErrorSchema } from '@/structures/schemas/HTTP5xxError.js';
import { responseMessageSchema } from '@/structures/schemas/ResponseMessage.js';
import { getUniqueAlbumIdentifier } from '@/utils/Util.js';

export const schema = {
	summary: 'Create link',
	description: 'Creates a new album link',
	tags: ['Albums'],
	params: z
		.object({
			uuid: z.string().describe('The uuid of the album.')
		})
		.required(),
	response: {
		200: z.object({
			message: responseMessageSchema,
			data: z.object({
				identifier: z.string().describe('The identifier of the link'),
				uuid: z.string().describe('The uuid of the link'),
				albumId: z.string().describe('The album id of the link'),
				enabled: z.boolean().describe('Whether the link is enabled'),
				enableDownload: z.boolean().describe('Whether the link allows downloads'),
				expiresAt: z.date().nullable().describe('The expiration date of the link'),
				views: z.number().describe('The amount of views the link has')
			})
		}),
		'4xx': http4xxErrorSchema,
		'5xx': http5xxErrorSchema
	}
};

export const options = {
	url: '/album/:uuid/link',
	method: 'post',
	middlewares: ['apiKey', 'auth']
};

export const run = async (req: RequestWithUser, res: FastifyReply) => {
	const { uuid } = req.params as { uuid: string };

	const exists = await prisma.albums.findFirst({
		where: {
			uuid,
			userId: req.user.id
		}
	});

	if (!exists) {
		void res.badRequest("Album doesn't exist or doesn't belong to the user");
		return;
	}

	let { identifier } = req.body as { identifier?: string };
	if (identifier) {
		if (!req.user?.roles.some(role => role.name === 'admin')) {
			void res.unauthorized('Only administrators can create custom links');
			return;
		}

		if (!/^[\w-]+$/.test(identifier)) {
			void res.badRequest('Only alphanumeric, dashes, and underscore characters are allowed');
			return;
		}

		const identifierExists = await prisma.links.findFirst({
			where: {
				identifier
			}
		});
		if (identifierExists) {
			void res.conflict('Album with this identifier already exists');
			return;
		}
	} else {
		identifier = await getUniqueAlbumIdentifier();
		if (!identifier) {
			void res.internalServerError('There was a problem allocating a link for your album');
			return;
		}
	}

	const insertObj = {
		identifier,
		userId: req.user.id,
		uuid: uuidv4(),
		albumId: exists.id,
		enabled: true,
		enableDownload: true,
		expiresAt: null,
		views: 0
	};

	await prisma.links.create({
		data: insertObj
	});

	return res.send({
		message: 'Successfully created link',
		data: {
			identifier,
			uuid: insertObj.uuid,
			albumId: exists.uuid,
			enabled: insertObj.enabled,
			enableDownload: insertObj.enableDownload,
			expiresAt: insertObj.expiresAt,
			views: insertObj.views
		}
	});
};
