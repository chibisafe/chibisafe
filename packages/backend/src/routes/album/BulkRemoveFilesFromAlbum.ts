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
	body: z.array(
		z.object({
			album: z.string().describe('The uuid of the album.'),
			files: z.array(z.string()).describe('The uuids of the files.')
		})
	),
	response: {
		200: z.object({
			message: responseMessageSchema
		}),
		'4xx': http4xxErrorSchema,
		'5xx': http5xxErrorSchema
	}
};

export const options = {
	url: '/files/album/remove',
	method: 'post',
	middlewares: ['apiKey', 'auth']
};

export const run = async (req: RequestWithUser, res: FastifyReply) => {
	const data = req.body as z.infer<typeof schema.body>;

	if (!data?.length) {
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
		for (const { album, files } of data) {
			for (const file of files) {
				await prisma.files.update({
					where: {
						uuid: file,
						userId: req.user.id
					},
					data: {
						albums: {
							disconnect: {
								uuid: album
							}
						}
					}
				});
			}

			await prisma.albums.update({
				where: {
					uuid: album
				},
				data: {
					editedAt: now
				}
			});
		}
	} catch (error: any) {
		console.error(error);
		void res.internalServerError('Failed to remove files to album');
		return;
	}

	return res.send({
		message: 'Successfully removed files from album'
	});
};
