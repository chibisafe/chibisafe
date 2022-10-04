import type { Response } from 'hyper-express';
import prisma from '../../structures/database';
import type { RequestWithUser } from '../../structures/interfaces';

export const options = {
	url: '/tag/:uuid',
	method: 'delete',
	middlewares: ['auth']
};

export const run = async (req: RequestWithUser, res: Response) => {
	const { uuid } = req.path_parameters;
	if (!uuid) return res.status(400).json({ message: 'No uuid provided' });

	const tag = await prisma.tags.findFirst({
		where: {
			userId: req.user.id,
			uuid
		}
	});

	if (!tag) return res.status(400).json({ message: "The tag doesn't exist or doesn't belong to the user" });

	await prisma.tags.delete({
		where: {
			uuid
		}
	});

	return res.json({
		message: 'Successfully deleted the tag'
	});
};
