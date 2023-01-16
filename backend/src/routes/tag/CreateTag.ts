import type { Response } from 'hyper-express';
import prisma from '../../structures/database';
import type { RequestWithUser } from '../../structures/interfaces';
import { v4 as uuidv4 } from 'uuid';
import { utc } from 'moment';

export const options = {
	url: '/tag/create',
	method: 'post',
	middlewares: ['auth']
};

export const run = async (req: RequestWithUser, res: Response) => {
	const { name } = await req.json();
	if (!name) return res.status(400).json({ message: 'No name provided' });

	const exists = await prisma.tags.findFirst({
		where: {
			name,
			userId: req.user.id
		}
	});

	if (exists) return res.status(400).json({ message: "There's already a tag with that name" });

	const now = utc().toDate();
	const newTag = await prisma.tags.create({
		data: {
			name,
			userId: req.user.id,
			uuid: uuidv4(),
			createdAt: now,
			editedAt: now
		}
	});

	return res.json({
		message: 'Successfully created tag',
		data: {
			uuid: newTag.uuid,
			name: newTag.name,
			createdAt: newTag.createdAt
		}
	});
};
