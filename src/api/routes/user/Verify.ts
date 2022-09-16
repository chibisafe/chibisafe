import type { Response } from 'hyper-express';
import { RequestWithUser } from '../../structures/interfaces';

export const url = '/verify';
export const method = 'GET';
export const middlewares = ['auth'];

export const run = (req: RequestWithUser, res: Response) => res.status(200).json(req.user);
