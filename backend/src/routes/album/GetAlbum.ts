import type { Response } from 'hyper-express';
import prisma from '../../structures/database';
import { constructFilePublicLink } from '../../utils/File';
import type { ExtendedFile, File, RequestWithUser } from '../../structures/interfaces';

export const options = {
	url: '/album/:uuid',
	method: 'get',
	middlewares: ['auth']
};

export const run = async (req: RequestWithUser, res: Response) => {
	const { uuid } = req.path_parameters;
	if (!uuid) return res.status(400).json({ message: 'Invalid uuid supplied' });

	// Set up pagination options
	const { page = 1, limit = 50 } = req.query_parameters as { page?: number; limit?: number };
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
			id: true,
			name: true,
			nsfw: true,
			files: {
				select: {
					uuid: true,
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

	if (!album) return res.status(404).json({ message: 'The album could not be found' });

	// Construct the public links
	const files = [] as File[];
	for (const file of album.files) {
		const modifiedFile = file as File;
		files.push(constructFilePublicLink(req, modifiedFile));
	}

	return res.json({
		message: 'Successfully retrieved album',
		name: album.name,
		files,
		isNsfw: album.nsfw,
		filesCount: album._count.files
	});
};
