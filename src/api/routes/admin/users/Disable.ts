import type { Response } from 'hyper-express';
import type { RequestWithUser } from '../../../structures/interfaces';
import prisma from '../../../structures/database';

export const url = '/admin/user/:uuid/disable';
export const method = 'POST';
export const middlewares = ['auth', 'admin'];

export const run = async (req: RequestWithUser, res: Response) => {
	const { uuid } = req.path_parameters;
	if (!uuid) return res.status(400).json({ message: 'Invalid uuid supplied' });
	if (uuid === req.user.uuid) return res.status(400).json({ message: "You can't apply this action to yourself" });

	await prisma.users.update({
		where: {
			uuid
		},
		data: {
			enabled: false
		}
	});

	return res.json({
		message: 'Successfully disabled user'
	});
};
