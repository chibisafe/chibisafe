import type { Response } from 'hyper-express';
import type { RequestWithUser } from '../../../structures/interfaces';
import prisma from '../../../structures/database';

interface body {
	identifier: string;
	enableDownload: boolean;
	expiresAt: Date;
}

export const middlewares = ['auth'];

export const run = async (req: RequestWithUser, res: Response) => {
	if (!req.body) return res.status(400).json({ message: 'No body provided' });
	const { identifier, enableDownload, expiresAt } = req.body as body;
	if (!identifier) return res.status(400).json({ message: 'No identifier provided' });

	const link = await prisma.links.findFirst({
		where: {
			userId: req.user.id,
			identifier
		}
	});

	if (!link) return res.status(400).json({ message: 'No link found' });

	const updateObj = {
		enableDownload: enableDownload || false,
		expiresAt // This one should be null if not supplied
	};

	await prisma.links.update({
		where: {
			identifier
		},
		data: {
			...updateObj
		}
	});

	return res.json({
		message: 'Successfully edited link'
	});
};
