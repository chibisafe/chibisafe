import type { Response, MiddlewareNext } from 'hyper-express';
import type { RequestWithUser } from '../structures/interfaces';

export default (req: RequestWithUser, res: Response, next: MiddlewareNext) => {
	if (!req.user?.isAdmin) {
		return res.status(401).json({ message: 'Permission denied' });
	}

	next();
};
