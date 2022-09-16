import prisma from '../../../structures/database';
import type { Request, Response } from 'hyper-express';

export const options = {
	url: '/admin/user/:uuid/purge',
	method: 'post',
	middlewares: ['auth', 'admin']
};

export const run = async (req: Request, res: Response) => {
	const { uuid } = req.path_parameters;
	if (!uuid) return res.status(400).json({ message: 'Invalid uuid supplied' });

	const user = await prisma.users.findUnique({
		where: {
			uuid
		}
	});

	if (!user) return res.status(400).json({ message: 'User not found' });

	await prisma.files.deleteMany({
		where: {
			userId: user.id
		}
	});

	await prisma.albums.deleteMany({
		where: {
			userId: user.id
		}
	});

	// TODO: Delete albumLinks, albumFiles, fileTags, links, tags

	return res.json({
		message: 'Successfully purged user'
	});
};
