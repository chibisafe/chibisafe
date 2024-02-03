import type { FastifyReply } from 'fastify';
import prisma from '@/structures/database.js';
import type { ExtendedFile, RequestWithUser } from '@/structures/interfaces.js';
import { constructFilePublicLink } from '@/utils/File.js';

export const options = {
	url: '/file/:uuid',
	method: 'get',
	middlewares: ['apiKey', 'auth']
};

export const run = async (req: RequestWithUser, res: FastifyReply) => {
	const { uuid } = req.params as { uuid: string };

	// Make sure the file exists and belongs to the user
	const file = (await prisma.files.findFirst({
		where: {
			uuid,
			userId: req.user.id
		},
		include: {
			albums: {
				select: {
					uuid: true,
					name: true
				},
				orderBy: {
					id: 'desc'
				}
			},
			tags: {
				select: {
					uuid: true,
					name: true
				},
				orderBy: {
					id: 'desc'
				}
			}
		}
	})) as ExtendedFile | null;

	if (!file) {
		void res.notFound('The file could not be found');
		return;
	}

	// Build the public links
	let parsedFile: ExtendedFile = file;
	parsedFile = {
		...file,
		...constructFilePublicLink({ req, fileName: file.name, isS3: file.isS3 })
	};

	return res.send({
		message: 'Successfully retrieved file',
		file: parsedFile
	});
};
