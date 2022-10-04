import type { Request, Response } from 'hyper-express';
import prisma from '../../structures/database';
import { constructFilePublicLink } from '../../utils/File';
import type { User } from '../../structures/interfaces';

export const options = {
	url: '/admin/file/:uuid',
	method: 'post',
	middlewares: ['auth', 'admin']
};

interface UserWithFileCount extends User {
	fileCount?: number;
}

export const run = async (req: Request, res: Response) => {
	const { uuid } = req.path_parameters;
	if (!uuid) return res.status(400).json({ message: 'Invalid file ID supplied' });

	const file = await prisma.files.findUnique({
		where: {
			uuid
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
