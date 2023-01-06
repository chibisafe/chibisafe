import type { Request, Response } from 'hyper-express';
import prisma from '../../../structures/database';
import { constructFilePublicLink } from '../../../utils/File';

export const options = {
	url: '/admin/user/:uuid',
	method: 'get',
	middlewares: ['auth', 'admin']
};

export const run = async (req: Request, res: Response) => {
	const { uuid } = req.path_parameters;
	if (!uuid) return res.status(400).json({ message: 'Invalid uuid supplied' });

	const user = await prisma.users.findUnique({
		where: {
			uuid
		},
		select: {
			uuid: true,
			username: true,
			enabled: true,
			isAdmin: true,
			createdAt: true,
			editedAt: true,
			apiKeyEditedAt: true
		}
	});

	if (!user) return res.status(404).json({ message: 'User not found' });

	return res.json({
		message: 'Successfully retrieved user',
		user
	});
};
