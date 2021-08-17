import type { FastifyReply } from 'fastify';
import type { RequestWithUser } from '../../../../structures/interfaces';
import prisma from '../../../../structures/database';

interface body {
	identifier: string;
	enableDownload: boolean;
	expiresAt: Date;
}

export const middlewares = ['auth'];

export const run = async (req: RequestWithUser, res: FastifyReply) => {
	if (!req.params) return res.status(400).send({ message: 'No body provided' });
	const { identifier, enableDownload, expiresAt } = req.body as body;
	if (!identifier) return res.status(400).send({ message: 'No identifier provided' });

	const link = await prisma.links.findFirst({
		where: {
			userId: req.user.id,
			identifier
		}
	});

	if (!link) return res.status(400).send({ message: 'No link found' });

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

	return res.send({
		message: 'Successfully edited link'
	});
};
