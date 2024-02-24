import type { FastifyReply } from 'fastify';
import { z } from 'zod';
import prisma from '@/structures/database.js';
import type { RequestWithUser } from '@/structures/interfaces.js';
import { http4xxErrorSchema } from '@/structures/schemas/HTTP4xxError.js';
import { http5xxErrorSchema } from '@/structures/schemas/HTTP5xxError.js';
import { responseMessageSchema } from '@/structures/schemas/ResponseMessage.js';

export const schema = {
	summary: 'Edit link',
	description: 'Edits an album link',
	tags: ['Albums'],
	params: z
		.object({
			uuid: z.string().describe('The uuid of the album.'),
			linkUuid: z.string().describe('The uuid of the link.')
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
	url: '/album/:uuid/link/:linkUuid/edit',
	method: 'post',
	middlewares: ['apiKey', 'auth']
};

export const run = async (req: RequestWithUser, res: FastifyReply) => {
	const { uuid, linkUuid } = req.params as { linkUuid: string; uuid: string };

	const { enabled, enableDownload, expiresAt } = req.body as {
		enableDownload?: boolean;
		enabled?: boolean;
		expiresAt?: Date;
	};

	const album = await prisma.albums.findFirst({
		where: {
			uuid,
			userId: req.user.id
		}
	});

	if (!album) {
		void res.badRequest("Album doesn't exist or doesn't belong to the user");
		return;
	}

	const link = await prisma.links.findFirst({
		where: {
			userId: req.user.id,
			albumId: album.id,
			uuid: linkUuid
		}
	});

	if (!link) {
		void res.notFound('No link found');
		return;
	}

	const updateObj = {
		enabled: enabled === true ? true : enabled === false ? false : link.enabled,
		enableDownload: enableDownload === true ? true : enableDownload === false ? false : link.enableDownload,
		expiresAt: expiresAt!
	};

	await prisma.links.update({
		where: {
			uuid: linkUuid
		},
		data: {
			...updateObj
		}
	});

	return res.send({
		message: 'Successfully edited link'
	});
};
