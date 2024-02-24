import type { FastifyReply } from 'fastify';
import { z } from 'zod';
import prisma from '@/structures/database.js';
import type { RequestWithUser } from '@/structures/interfaces.js';
import { http4xxErrorSchema } from '@/structures/schemas/HTTP4xxError.js';
import { http5xxErrorSchema } from '@/structures/schemas/HTTP5xxError.js';
import { responseMessageSchema } from '@/structures/schemas/ResponseMessage.js';

export const schema = {
	summary: 'Purge album',
	description: 'Purges an album and all its files',
	tags: ['Albums'],
	params: z
		.object({
			uuid: z.string().describe('The uuid of the album.')
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
	url: '/album/:uuid/purge',
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

		const albumFiles = await prisma.albums.findFirst({
			where: {
				uuid,
				userId: req.user.id
			},
			select: {
				files: {
					select: {
						id: true
					}
				}
			}
		});

		const fileIds = albumFiles?.files.map((file: any) => file.id) ?? [];

		await prisma.files.deleteMany({
			where: {
				id: {
					in: fileIds
				}
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
