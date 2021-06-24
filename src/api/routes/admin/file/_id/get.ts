import type { FastifyRequest, FastifyReply } from 'fastify';
import prisma from '../../../../structures/database';
import { constructFilePublicLink } from '../../../../utils/Util';
import type { User } from '../../../../structures/interfaces';
interface params {
	id: number;
}
interface UserWithFileCount extends User {
	fileCount?: number;
}
export const middlewares = ['auth', 'admin'];
export const run = async (req: FastifyRequest, res: FastifyReply) => {
	const { id } = req.params as params;
	if (!id) return res.status(400).send({ message: 'Invalid file ID supplied' });

	const file = await prisma.files.findUnique({
		where: {
			id
		}
	});

	if (!file) return res.status(404).send({ message: 'File doesn\'t exist' });

	let user;
	if (file.userId) {
		user = await prisma.users.findUnique({
			where: {
				id: file.userId
			},
			select: {
				id: true,
				username: true,
				enabled: true,
				createdAt: true,
				editedAt: true,
				isAdmin: true
			}
		});

		if (user) {
			// TODO: ???
			(user as unknown as UserWithFileCount).fileCount = await prisma.files.count({
				where: {
					userId: user.id
				}
			});
		}
	}
	const extendedFile = constructFilePublicLink(req, file);

	return res.send({
		message: 'Successfully retrieved file',
		file: extendedFile,
		user
	});
};
