import type { FastifyReply } from 'fastify';
import prisma from '../../structures/database';
import type { RequestWithUser } from '../../structures/interfaces';

export const options = {
	url: '/album/:uuid',
	method: 'delete',
	middlewares: ['auth']
};

export const run = async (req: RequestWithUser, res: FastifyReply) => {
	const { uuid } = req.params as { uuid?: string };
	if (!uuid) return res.code(400).send({ message: 'No uuid provided' });

	const album = await prisma.albums.findFirst({
		where: {
			userId: req.user.id,
			uuid
		}
	});

	if (!album) return res.code(400).send({ message: "The album doesn't exist or doesn't belong to the user" });

	try {
		await prisma.links.deleteMany({
			where: {
				albumId: album.id
			}
		});

		await prisma.albums.delete({
			where: {
				uuid
			}
		});

		return await res.send({
			message: 'Successfully deleted the album'
		});
	} catch {
		return res.code(500).send({ message: 'An error occurred while deleting the album' });
	}
};
