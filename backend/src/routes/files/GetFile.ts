import type { Response } from 'hyper-express';
import prisma from '../../structures/database';
import { constructFilePublicLink } from '../../utils/File';
import type { ExtendedFile, RequestWithUser } from '../../structures/interfaces';

export const options = {
	url: '/file/:uuid',
	method: 'get',
	middlewares: ['auth']
};

export const run = async (req: RequestWithUser, res: Response) => {
	const { uuid } = req.path_parameters;
	if (!uuid) return res.status(400).json({ message: 'Invalid uuid supplied' });

	// Make sure the file exists and belongs to the user
	const file = await prisma.files.findFirst({
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
	});

	if (!file) return res.status(404).json({ message: 'The file could not be found' });

	// Build the public links
	let parsedFile: ExtendedFile = file;
	parsedFile = constructFilePublicLink(req, file);

	return res.json({
		message: 'Successfully retrieved file',
		file: parsedFile
	});
};
