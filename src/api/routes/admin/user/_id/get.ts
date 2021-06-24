import type { FastifyRequest, FastifyReply } from 'fastify';
import prisma from '../../../../structures/database';
import { constructFilePublicLink } from '../../../../utils/Util';

export const middlewares = ['auth', 'admin'];

interface params {
	id: number;
}
export const run = async (req: FastifyRequest, res: FastifyReply) => {
	const { id } = req.params as params;
	if (!id) return res.status(400).send({ message: 'Invalid user ID supplied' });

	const { page = 1, limit = 100 } = req.query as { page: number; limit: number };

	const user = await prisma.users.findUnique({
		where: {
			id
		},
		select: {
			id: true,
			username: true,
			enabled: true,
			isAdmin: true,
			createdAt: true,
			editedAt: true,
			apiKeyEditedAt: true
		}
	});

	if (!user) return res.status(404).send({ message: 'User not found' });

	const count = await prisma.files.count({
		where: {
			userId: user.id
		}
	});

	const files = await prisma.files.findMany({
		take: limit,
		skip: (page - 1) * limit,
		where: {
			userId: user.id
		}
	});

	const readyFiles = [];
	for (const file of files) {
		readyFiles.push(constructFilePublicLink(req, file));
	}

	return res.send({
		message: 'Successfully retrieved users',
		user,
		files: readyFiles,
		count
	});
};
