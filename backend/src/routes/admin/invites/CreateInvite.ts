import type { Response } from 'hyper-express';
import type { RequestWithUser } from '../../../structures/interfaces';
import prisma from '../../../structures/database';
import { v4 as uuidv4 } from 'uuid';

export const options = {
	url: '/admin/invite/create',
	method: 'post',
	middlewares: ['auth', 'admin']
};

export const run = async (req: RequestWithUser, res: Response) => {
	const code = uuidv4();
	await prisma.invites.create({
		data: {
			code,
			createdBy: req.user.uuid
		}
	});

	return res.json({
		message: 'Successfully created invite',
		code
	});
};
