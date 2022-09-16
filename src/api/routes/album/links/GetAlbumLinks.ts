import type { Response } from 'hyper-express';
import type { RequestWithUser } from '../../../structures/interfaces';
import prisma from '../../../structures/database';

export const options = {
	url: '/album/:uuid/links',
	method: 'get',
	middlewares: ['auth']
};

export const run = async (req: RequestWithUser, res: Response) => {
	const { uuid } = req.path_parameters;
	if (!uuid) return res.status(400).json({ message: 'Invalid uuid supplied' });

	const links = await prisma.links.findMany({
		where: {
			uuid,
			userId: req.user.id
		}
	});

	return res.json({
		message: 'Successfully retrieved links',
		links
	});
};
