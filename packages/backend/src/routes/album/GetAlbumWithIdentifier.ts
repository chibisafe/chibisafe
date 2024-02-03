import type { FastifyRequest, FastifyReply } from 'fastify';
import prisma from '@/structures/database.js';
import type { File } from '@/structures/interfaces.js';
import { constructFilePublicLink } from '@/utils/File.js';

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
					isS3: true
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
			...constructFilePublicLink({ req, fileName: modifiedFile.name, isS3: file.isS3 })
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
