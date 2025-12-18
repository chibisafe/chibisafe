import type { FastifyReply } from 'fastify';
import { z } from 'zod';
import prisma from '@/structures/database.js';
import type { RequestWithUser } from '@/structures/interfaces.js';
import { http4xxErrorSchema } from '@/structures/schemas/HTTP4xxError.js';
import { http5xxErrorSchema } from '@/structures/schemas/HTTP5xxError.js';
import { responseMessageSchema } from '@/structures/schemas/ResponseMessage.js';
import { isValidSortOrder } from '@/utils/SortOrder.js';

export const schema = {
	summary: 'Update album',
	description: 'Updates an album',
	tags: ['Albums'],
	params: z
		.object({
			uuid: z.string().describe('The uuid of the album.')
		})
		.required(),
	body: z.object({
		name: z.string().optional().describe('The name of the album.'),
		description: z.string().optional().describe('The description of the album.'),
		nsfw: z.boolean().optional().describe('Whether the album is nsfw or not.'),
		sortOrder: z.string().optional().nullable().describe('The sort order for files in this album.')
	}),
	response: {
		200: z.object({
			message: responseMessageSchema
		}),
		'4xx': http4xxErrorSchema,
		'5xx': http5xxErrorSchema
	}
};

export const options = {
	url: '/album/:uuid/edit',
	method: 'post',
	middlewares: ['apiKey', 'auth']
};

export const run = async (req: RequestWithUser, res: FastifyReply) => {
	const { uuid } = req.params as { uuid: string };

	const { name, nsfw, description, sortOrder } = req.body as {
		description?: string;
		name?: string;
		nsfw?: boolean;
		sortOrder?: string | null;
	};
	if (!name && nsfw === undefined && !description && sortOrder === undefined) {
		void res.badRequest('No data supplied');
		return;
	}

	if (sortOrder !== undefined && sortOrder !== null && !isValidSortOrder(sortOrder)) {
		void res.badRequest('Invalid sort order. Valid options: createdAt:asc, createdAt:desc, name:asc, name:desc, id:desc');
		return;
	}

	// Make sure the album exists and belongs to the user
	const album = await prisma.albums.findFirst({
		where: {
			uuid,
			userId: req.user.id
		}
	});

	if (!album) {
		void res.notFound("The album doesn't exist or doesn't belong to the user");
		return;
	}

	const updateObj = {
		name: name ?? album.name,
		nsfw: nsfw === true ? true : nsfw === false ? false : album.nsfw,
		description: description ?? album.description,
		sortOrder: sortOrder === undefined ? album.sortOrder : sortOrder
	};

	await prisma.albums.update({
		where: {
			uuid
		},
		data: {
			...updateObj
		}
	});

	return res.send({
		message: 'Successfully edited the album'
	});
};
