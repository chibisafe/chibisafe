import type { FastifyReply } from 'fastify';
import prisma from '../../../../../structures/database';
import { RequestWithUser } from '../../../../../structures/interfaces';

interface body {
	identifier: string;
}
export const middlewares = ['auth'];

export const run = async (req: RequestWithUser, res: FastifyReply) => {
	if (!req.params) return res.status(400).send({ message: 'No body provided' });
	const { identifier } = req.body as body;
	if (!identifier) return res.status(400).send({ message: 'No ip provided' });

	const link = await prisma.links.findFirst({
		where: {
			identifier,
			userId: req.user.id
		}
	});

	await prisma.links.delete({
		where: {
			links_userid_albumid_identifier_unique: {
				
			}
		}
	});

	const albumLink = await prisma.albumsLinks.findFirst({
		where: {
			linkId: link.id
		}
	});

	await prisma.albumsLinks.delete({
		where: {
			id: albumLink.id
		}
	});

	return res.send({
		message: 'Successfully banned the ip'
	});
};
