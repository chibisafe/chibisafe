import type { Response } from 'hyper-express';
import prisma from '../../structures/database';
import { RequestWithUser } from '../../structures/interfaces';

export const options = {
	url: '/tags',
	method: 'get',
	middlewares: ['auth']
};

export const run = async (req: RequestWithUser, res: Response) => {
	const tags = await prisma.tags.findMany({
		where: {
			userId: req.user.id
		}
	});

	return res.json({
		message: 'Successfully fetched tags',
		data: tags
	});
};
