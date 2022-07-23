import type { Request, Response } from 'hyper-express';
import prisma from '../../../../structures/database';
import { constructFilePublicLink } from '../../../../utils/file';
import type { User } from '../../../../structures/interfaces';

interface UserWithFileCount extends User {
	fileCount?: number;
}

export const middlewares = ['auth', 'admin'];

export const run = async (req: Request, res: Response) => {
	const { id } = req.path_parameters;
	if (!id) return res.status(400).json({ message: 'Invalid file ID supplied' });

	const file = await prisma.files.findUnique({
		where: {
			id: Number(id)
		}
	});

	if (!file) return res.status(404).json({ message: "File doesn't exist" });

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

	return res.json({
		message: 'Successfully retrieved file',
		file: extendedFile,
		user
	});
};
