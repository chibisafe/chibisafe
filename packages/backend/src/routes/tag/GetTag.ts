import type { FastifyReply } from 'fastify';
import prisma from '@/structures/database.js';
import type { File, RequestWithUser } from '@/structures/interfaces.js';
import { constructFilePublicLink } from '@/utils/File.js';

export const options = {
	url: '/tag/:uuid',
	method: 'get',
	middlewares: ['apiKey', 'auth']
};

export const run = async (req: RequestWithUser, res: FastifyReply) => {
	const { uuid } = req.params as { uuid: string };

	// Set up pagination options
	const { page = 1, limit = 50 } = req.query as { limit?: number; page?: number };
	const options = {
		take: limit,
		skip: (page - 1) * limit
	};

	// Make sure the uuid exists and it belongs to the user
	const tag = await prisma.tags.findFirst({
		where: {
			uuid,
			userId: req.user.id
		},
		select: {
			name: true,
			files: {
				select: {
					createdAt: true,
					hash: true,
					ip: true,
					name: true,
					original: true,
					size: true,
					type: true,
					uuid: true,
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

	if (!tag) {
		void res.notFound('The tag could not be found');
		return;
	}

	// Construct the public links
	const files = [] as File[];
	for (const file of tag.files) {
		const modifiedFile = file as unknown as File;
		files.push({
			...modifiedFile,
			...constructFilePublicLink({ req, fileName: modifiedFile.name, isS3: modifiedFile.isS3 })
		});
	}

	return res.send({
		message: 'Successfully retrieved tag',
		name: tag.name,
		files,
		count: tag._count.files
	});
};
