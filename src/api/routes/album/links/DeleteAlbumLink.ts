import type { Response } from 'hyper-express';
import prisma from '../../../structures/database';
import { RequestWithUser } from '../../../structures/interfaces';

export const options = {
	url: '/album/:uuid/link/:identifier',
	method: 'delete',
	middlewares: ['auth']
};

export const run = async (req: RequestWithUser, res: Response) => {
	const { identifier } = req.path_parameters;
	if (!identifier) return res.status(400).json({ message: 'No identifier provided' });

	const link = await prisma.links.findFirst({
		where: {
			userId: req.user.id,
			identifier
		}
	});

	if (!link) return res.status(400).json({ message: 'No link found' });

	await prisma.links.delete({
		where: {
			identifier
		}
	});

	await prisma.albumsLinks.delete({
		where: {
			linkId: link.id
		}
	});

	return res.json({
		message: 'Successfully deleted the link'
	});
};
