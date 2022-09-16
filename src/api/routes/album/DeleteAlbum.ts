import type { Response } from 'hyper-express';
import prisma from '../../structures/database';
import { RequestWithUser } from '../../structures/interfaces';

export const url = '/album/:uuid/';
export const method = 'DELETE';
export const middlewares = ['auth'];

export const run = async (req: RequestWithUser, res: Response) => {
	const { uuid } = req.path_parameters;
	if (!uuid) return res.status(400).json({ message: 'No uuid provided' });

	const album = await prisma.albums.findFirst({
		where: {
			userId: req.user.id,
			uuid
		}
	});

	if (!album) return res.status(400).json({ message: "The album doesn't exist or doesn't belong to the user" });

	try {
		await prisma.albums.delete({
			where: {
				uuid
			}
		});

		await prisma.albumsFiles.deleteMany({
			where: {
				albumId: album.id
			}
		});

		await prisma.albumsLinks.deleteMany({
			where: {
				albumId: album.id
			}
		});

		await prisma.links.deleteMany({
			where: {
				albumId: album.id
			}
		});

		return res.json({
			message: 'Successfully deleted the link'
		});
	} catch (e) {
		return res.status(500).json({ message: 'An error occurred while deleting the album' });
	}
};
