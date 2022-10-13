import type { Response } from 'hyper-express';
import type { RequestWithUser } from '../../structures/interfaces';

export const options = {
	url: '/verify',
	method: 'get',
	middlewares: ['auth', 'apiKey']
};

export const run = (req: RequestWithUser, res: Response) => res.status(200).json(req.user);
