import type { FastifyRequest, FastifyReply } from 'fastify';
import { z } from 'zod';
import prisma from '@/structures/database.js';
import type { File } from '@/structures/interfaces.js';
import { http4xxErrorSchema } from '@/structures/schemas/HTTP4xxError.js';
import { http5xxErrorSchema } from '@/structures/schemas/HTTP5xxError.js';
import { queryLimitSchema } from '@/structures/schemas/QueryLimit.js';
import { queryPageSchema } from '@/structures/schemas/QueryPage.js';
import { responseMessageSchema } from '@/structures/schemas/ResponseMessage.js';
import { constructFilePublicLink } from '@/utils/File.js';

export const schema = {
	summary: 'Get public album',
	description: 'Gets a public album link with its contents',
	tags: ['Albums'],
	params: z
		.object({
			identifier: z.string().describe('The identifier of the link used to access the album.')
		})
		.required(),
	query: z.object({
		page: queryPageSchema,
		limit: queryLimitSchema
	}),
	response: {
		200: z.object({
			message: responseMessageSchema,
			album: z.object({
				name: z.string().describe('The name of the album.'),
				description: z.string().describe('The description of the album.'),
				isNsfw: z.boolean().describe('Whether or not the album is NSFW.'),
				count: z.number().describe('The amount of files in the album.'),
				files: z.array(
					z.object({
						name: z.string().describe('The name of the file.'),
						type: z.string().describe('The type of the file.'),
						url: z.string().describe('The URL of the file.'),
						thumb: z.string().describe('The URL of the thumbnail of the file.'),
						thumbSquare: z.string().describe('The URL of the square thumbnail of the file.'),
						preview: z.string().describe('The URL of the preview of the file.')
					})
				)
			})
		}),
		'4xx': http4xxErrorSchema,
		'5xx': http5xxErrorSchema
	}
};

export const options = {
	url: '/album/:identifier/view',
	method: 'get'
};

export const run = async (req: FastifyRequest, res: FastifyReply) => {
	const { identifier } = req.params as { identifier: string };

	// Set up pagination options
	const { page = 1, limit = 50 } = req.query as { limit?: number; page?: number };
	const options = {
		take: limit,
		skip: (page - 1) * limit
	};

	const link = await prisma.links.findFirst({
		where: {
			identifier,
			enabled: true
		},
		select: {
			albumId: true,
			expiresAt: true
		}
	});

	if (!link) {
		void res.notFound("The link is disabled or it doesn't exist");
		return;
	}

	if (link.expiresAt && link.expiresAt < new Date()) {
		void res.notFound('The link has expired');
		return;
	}

	// Make sure the uuid exists and it belongs to the user
	const album = await prisma.albums.findFirst({
		where: {
			id: link.albumId
		},
		select: {
			name: true,
			description: true,
			nsfw: true,
			files: {
				select: {
					name: true,
					type: true,
					isS3: true,
					isWatched: true
				},
				orderBy: {
					id: 'desc'
				},
				...options
			},
			_count: true
		}
	});

	if (!album) {
		void res.notFound('The album could not be found');
		return;
	}

	// Construct the public links
	const files = [] as File[];
	for (const file of album.files) {
		const modifiedFile = file as File;
		files.push({
			...modifiedFile,
			...constructFilePublicLink({ req, fileName: modifiedFile.name, isS3: file.isS3, isWatched: file.isWatched })
		});
	}

	// await prisma.links.update({
	// 	where: {
	// 		identifier
	// 	},
	// 	data: {
	// 		views: {
	// 			increment: 1
	// 		}
	// 	}
	// });

	return res.send({
		message: 'Successfully retrieved album',
		album: {
			name: album.name,
			description: album.description,
			files,
			isNsfw: album.nsfw,
			count: album._count.files
		}
	});
};
