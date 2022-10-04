import type { Response } from 'hyper-express';
import { RequestWithUser } from '../../structures/interfaces';

export const options = {
	url: '/verify',
	method: 'get',
	middlewares: ['auth']
};

export const run = (req: RequestWithUser, res: Response) => res.status(200).json(req.user);
