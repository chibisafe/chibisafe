import type { Response } from 'hyper-express';
import type { RequestWithUser } from '../../../structures/interfaces';
import prisma from '../../../structures/database';

export const options = {
	url: '/album/:uuid/link/:identifier/edit',
	method: 'post',
	middlewares: ['auth']
};

export const run = async (req: RequestWithUser, res: Response) => {
	const { identifier } = req.path_parameters;
	if (!identifier) return res.status(400).json({ message: 'No identifier provided' });
	const { enableDownload, expiresAt } = await req.json();

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
