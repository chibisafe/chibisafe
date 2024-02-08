import type { FastifyReply } from 'fastify';
import { z } from 'zod';
import prisma from '@/structures/database.js';
import type { RequestWithUser, Album } from '@/structures/interfaces.js';
import { http4xxErrorSchema } from '@/structures/schemas/HTTP4xxError.js';
import { http5xxErrorSchema } from '@/structures/schemas/HTTP5xxError.js';
import { responseMessageSchema } from '@/structures/schemas/ResponseMessage.js';
import { constructFilePublicLink } from '@/utils/File.js';

export const schema = {
	summary: 'Get albums',
	description: 'Gets all the albums',
	tags: ['Albums'],
	response: {
		200: z.object({
			message: responseMessageSchema,
			albums: z.array(
				z.object({
					uuid: z.string().describe('The uuid of the album.'),
					name: z.string().describe('The name of the album.'),
					description: z.string().nullable().describe('The description of the album.'),
					nsfw: z.boolean().describe('Whether or not the album is NSFW.'),
					zippedAt: z.date().nullable().describe('The date and time the album was last zipped.'),
					createdAt: z.date().describe('The date and time the album was created.'),
					editedAt: z.date().describe('The date and time the album was last edited.'),
					cover: z.string().describe('The cover image of the album.'),
					count: z.number().describe('The amount of images in the album.')
				})
			)
		}),
		'4xx': http4xxErrorSchema,
		'5xx': http5xxErrorSchema
	}
};

export const options = {
	url: '/albums',
	method: 'get',
	middlewares: ['apiKey', 'auth']
};

export const run = async (req: RequestWithUser, res: FastifyReply) => {
	const albums = await prisma.albums.findMany({
		where: {
			userId: req.user.id
		},
		select: {
			uuid: true,
			name: true,
			description: true,
			nsfw: true,
			zippedAt: true,
			createdAt: true,
			editedAt: true,
			files: {
				orderBy: {
					id: 'asc'
				},
				take: 1
			},
			_count: true
		},
		orderBy: {
			name: 'desc'
		}
	});

	if (!albums.length)
		return res.send({
			message: 'Successfully retrieved albums',
			albums: []
		});

	// TODO: Instead of the first, being able to select a cover picture for an album would
	// be a neat feature

	const fetchedAlbums = [];
	for (const album of albums) {
		const newObject = {
			...album,
			cover: ('' as string) || undefined,
			count: album._count.files
			// file.size is BigInt because of prisma, so we need to convert it to a number
		} as unknown as Partial<Album>;

		delete newObject.files;
		delete newObject._count;

		newObject.cover = album.files[0]
			? constructFilePublicLink({ req, fileName: album.files[0].name as unknown as any }).thumb
			: '';
		fetchedAlbums.push(newObject);
	}

	return res.send({
		message: 'Successfully retrieved albums',
		albums: fetchedAlbums
	});
};
