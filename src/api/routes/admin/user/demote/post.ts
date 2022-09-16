import type { Response } from 'hyper-express';
import type { RequestWithUser } from '../../../../structures/interfaces';
import prisma from '../../../../structures/database';

export const middlewares = ['auth', 'admin'];

export const run = async (req: RequestWithUser, res: Response) => {
	if (!req.body) return res.status(400).json({ message: 'No body provided' });
	const { uuid } = req.body;

	if (!uuid) return res.status(400).json({ message: 'No id provided' });
	if (uuid === req.user.uuid) return res.status(400).json({ message: "You can't apply this action to yourself" });

	await prisma.users.update({
		where: {
			uuid
		},
		data: {
			isAdmin: false
		}
	});

	return res.json({
		message: 'Successfully demoted user'
	});
};
