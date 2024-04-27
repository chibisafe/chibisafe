import type { FastifyReply } from 'fastify';
import moment from 'moment';
import { z } from 'zod';
import prisma from '@/structures/database.js';
import type { RequestWithUser } from '@/structures/interfaces.js';
import { http4xxErrorSchema } from '@/structures/schemas/HTTP4xxError.js';
import { http5xxErrorSchema } from '@/structures/schemas/HTTP5xxError.js';
import { responseMessageSchema } from '@/structures/schemas/ResponseMessage.js';

export const schema = {
	summary: 'Remove files from album',
	description: 'Removes all the supplied files from an album',
	tags: ['Files', 'Albums', 'Bulk'],
	params: z
		.object({
			albumUuid: z.string().describe('The uuid of the album.')
		})
		.required(),
	body: z.object({
		files: z.array(z.string()).optional().nullable().default([])
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
	url: '/files/album/:albumUuid/delete',
	method: 'post',
	middlewares: ['apiKey', 'auth']
};

export const run = async (req: RequestWithUser, res: FastifyReply) => {
	const { files } = req.body as z.infer<typeof schema.body>;
	const { albumUuid } = req.params as z.infer<typeof schema.params>;

	if (!files?.length) {
		void res.badRequest('No file uuids provided');
		return;
	}

	const now = moment.utc().toDate();
	// Prisma doesn't support updating relations in bulk :D
	// https://github.com/prisma/prisma/issues/3143
	//
	// await prisma.files.updateMany({
	// 	where: {
	// 		uuid: {
	// 			in: files
	// 		}
	// 	},
	// 	data: {
	// 		albums: {
	// 			disconnect: {
	// 				uuid: albumUuid
	// 			}
	// 		}
	// 	}
	// });

	try {
		for (const file of files) {
			await prisma.files.update({
				where: {
					uuid: file,
					userId: req.user.id
				},
				data: {
					albums: {
						disconnect: {
							uuid: albumUuid
						}
					}
				}
			});
		}

		await prisma.albums.update({
			where: {
				uuid: albumUuid
			},
			data: {
				editedAt: now
			}
		});
	} catch (error: any) {
		console.error(error);
		void res.internalServerError('Failed to add files to album');
		return;
	}
	// This sucks but it's necessary until we move away from Prisma

	return res.send({
		message: 'Successfully removed files from album'
	});
};
