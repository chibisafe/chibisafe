import type { FastifyReply } from 'fastify';
import moment from 'moment';
import { z } from 'zod';
import prisma from '@/structures/database.js';
import type { RequestWithUser } from '@/structures/interfaces.js';
import { http4xxErrorSchema } from '@/structures/schemas/HTTP4xxError.js';
import { http5xxErrorSchema } from '@/structures/schemas/HTTP5xxError.js';
import { responseMessageSchema } from '@/structures/schemas/ResponseMessage.js';

export const schema = {
	summary: 'Add files to album',
	description: 'Adds all the supplied files to an album',
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
	url: '/files/album/add',
	method: 'post',
	middlewares: ['apiKey', 'auth']
};

export const run = async (req: RequestWithUser, res: FastifyReply) => {
	const data = req.body as z.infer<typeof schema.body>;

	if (!data?.length) {
		void res.badRequest('No data provided');
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
	// 			connect: {
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
							connect: {
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
		void res.internalServerError('Failed to add files to album');
		return;
	}

	return res.send({
		message: 'Successfully added files to album'
	});
};
