import type { FastifyReply } from 'fastify';
import prisma from '@/structures/database';
import { constructFilePublicLink } from '@/utils/File';
import type { ExtendedFile, File, RequestWithUser } from '@/structures/interfaces';

export const options = {
	url: '/album/:uuid',
	method: 'get',
	middlewares: ['auth']
};

export const run = async (req: RequestWithUser, res: FastifyReply) => {
	const { uuid } = req.params as { uuid?: string };
	if (!uuid) return res.code(400).send({ message: 'Invalid uuid supplied' });

	// Set up pagination options
	const { page = 1, limit = 50 } = req.query as { page?: number; limit?: number };
	const options = {
		take: limit,
		skip: (page - 1) * limit
	};

	// Make sure the uuid exists and it belongs to the user
	const album = await prisma.albums.findFirst({
		where: {
			uuid,
			userId: req.user.id
		},
		select: {
			name: true,
			nsfw: true,
			files: {
				select: {
					createdAt: true,
					hash: true,
					ip: true,
					name: true,
					original: true,
					size: true,
					type: true,
					uuid: true
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
		const modifiedFile = file as unknown as File;
		files.push(constructFilePublicLink(req, modifiedFile));
	}

	return res.send({
		message: 'Successfully retrieved album',
		name: album.name,
		files,
		isNsfw: album.nsfw,
		filesCount: album._count.files
	});
};
