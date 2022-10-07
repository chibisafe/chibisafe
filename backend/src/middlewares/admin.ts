import type { Response } from 'hyper-express';
import type { RequestWithUser } from '../structures/interfaces';

export default (req: RequestWithUser, res: Response) => {
	if (!req.user.isAdmin) return res.status(401).json({ message: 'You need to be an admin to access this resource' });
};
