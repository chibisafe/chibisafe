import type { FastifyReply } from 'fastify';
import { z } from 'zod';
import prisma from '@/structures/database.js';
import type { RequestWithUser } from '@/structures/interfaces.js';
import { http4xxErrorSchema } from '@/structures/schemas/HTTP4xxError.js';
import { http5xxErrorSchema } from '@/structures/schemas/HTTP5xxError.js';
import { responseMessageSchema } from '@/structures/schemas/ResponseMessage.js';

export const schema = {
	summary: 'Delete album',
	description: 'Deletes an album',
	tags: ['Albums'],
	response: {
		200: z.object({
			message: responseMessageSchema
		}),
		'4xx': http4xxErrorSchema,
		'5xx': http5xxErrorSchema
	}
};

export const options = {
	url: '/album/:uuid',
	method: 'delete',
	middlewares: ['apiKey', 'auth']
};

export const run = async (req: RequestWithUser, res: FastifyReply) => {
	const { uuid } = req.params as { uuid: string };

	const album = await prisma.albums.findFirst({
		where: {
			userId: req.user.id,
			uuid
		}
	});

	if (!album) {
		void res.badRequest("The album doesn't exist or doesn't belong to the user");
		return;
	}

	try {
		await prisma.links.deleteMany({
			where: {
				albumId: album.id
			}
		});

		await prisma.albums.delete({
			where: {
				uuid
			}
		});

		return await res.send({
			message: 'Successfully deleted the album'
		});
	} catch {
		void res.internalServerError('An error occurred while deleting the album');
	}
};
