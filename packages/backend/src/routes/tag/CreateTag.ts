import type { FastifyReply } from 'fastify';
import moment from 'moment';
import { v4 as uuidv4 } from 'uuid';
import prisma from '@/structures/database.js';
import type { RequestWithUser } from '@/structures/interfaces.js';

export const options = {
	url: '/tag/create',
	method: 'post',
	middlewares: ['apiKey', 'auth']
};

export const run = async (req: RequestWithUser, res: FastifyReply) => {
	const { name } = req.body as { name: string };

	const exists = await prisma.tags.findFirst({
		where: {
			name,
			userId: req.user.id
		}
	});

	if (exists) {
		void res.badRequest("There's already a tag with that name");
		return;
	}

	const now = moment.utc().toDate();
	const newTag = await prisma.tags.create({
		data: {
			name,
			userId: req.user.id,
			uuid: uuidv4(),
			createdAt: now,
			editedAt: now
		}
	});

	return res.send({
		message: 'Successfully created tag',
		tag: {
			uuid: newTag.uuid,
			name: newTag.name,
			createdAt: newTag.createdAt
		}
	});
};
