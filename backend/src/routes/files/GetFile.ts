import type { FastifyReply } from 'fastify';
import prisma from '../../structures/database';
import { constructFilePublicLink } from '../../utils/File';
import type { ExtendedFile, RequestWithUser } from '../../structures/interfaces';

export const options = {
	url: '/file/:uuid',
	method: 'get',
	middlewares: ['auth']
};

export const run = async (req: RequestWithUser, res: FastifyReply) => {
	const { uuid } = req.params as { uuid?: string };
	if (!uuid) return res.code(400).send({ message: 'Invalid uuid supplied' });

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

	if (!file) return res.code(404).send({ message: 'The file could not be found' });

	// Build the public links
	let parsedFile: ExtendedFile = file;
	parsedFile = constructFilePublicLink(req, file);

	return res.send({
		message: 'Successfully retrieved file',
		file: parsedFile
	});
};
