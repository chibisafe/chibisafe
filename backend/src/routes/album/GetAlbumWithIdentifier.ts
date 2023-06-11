import type { FastifyRequest, FastifyReply } from 'fastify';
import prisma from '@/structures/database';
import { constructFilePublicLink } from '@/utils/File';
import type { File } from '@/structures/interfaces';

export const options = {
	url: '/album/:identifier/view',
	method: 'get'
};

export const run = async (req: FastifyRequest, res: FastifyReply) => {
	const { identifier } = req.params as { identifier?: string };
	if (!identifier) return res.code(400).send({ message: 'Invalid identifier supplied' });

	// Set up pagination options
	const { page = 1, limit = 50 } = req.query as { page?: number; limit?: number };
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

	if (!link) return res.code(404).send({ message: "The link is disabled or it doesn't exist" });
	if (link.expiresAt && link.expiresAt < new Date()) return res.code(404).send({ message: 'The link has expired' });

	// Make sure the uuid exists and it belongs to the user
	const album = await prisma.albums.findFirst({
		where: {
			id: link.albumId
		},
		select: {
			name: true,
			nsfw: true,
			files: {
				select: {
					name: true,
					type: true
				},
				orderBy: {
					id: 'desc'
				},
				...options
			},
			_count: true
		}
	});

	if (!album) return res.code(404).send({ message: 'The album could not be found' });

	// Construct the public links
	const files = [] as File[];
	for (const file of album.files) {
		const modifiedFile = file as File;
		files.push(constructFilePublicLink(req, modifiedFile));
	}

	await prisma.links.update({
		where: {
			identifier
		},
		data: {
			views: {
				increment: 1
			}
		}
	});

	return res.send({
		message: 'Successfully retrieved album',
		name: album.name,
		files,
		isNsfw: album.nsfw,
		filesCount: album._count.files
	});
};
