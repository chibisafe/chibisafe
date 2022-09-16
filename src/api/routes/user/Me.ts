import type { Response } from 'hyper-express';
import type { RequestWithUser } from '../../structures/interfaces';

export const url = '/user/me';
export const method = 'GET';
export const middlewares = ['auth'];

export const run = (req: RequestWithUser, res: Response) =>
	res.json({
		message: 'Successfully retrieved user',
		user: {
			...req.user
		}
	});
