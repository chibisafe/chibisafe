import type { FastifyReply } from 'fastify';
import prisma from '@/structures/database.js';
import type { RequestWithUser } from '@/structures/interfaces.js';
import { generateThumbnails } from '@/utils/Thumbnails.js';

export const options = {
	url: '/file/:uuid/thumbnail/regenerate',
	method: 'post',
	middlewares: ['apiKey', 'auth']
};

export const run = async (req: RequestWithUser, res: FastifyReply) => {
	const { uuid } = req.params as { uuid: string };

	// Make sure the file exists and belongs to the user
	const file = await prisma.files.findFirst({
		where: {
			uuid,
			userId: req.user.id
		},
		select: {
			name: true
		}
	});

	if (!file) {
		void res.notFound('The file could not be found');
		return;
	}

	void generateThumbnails(file.name);

	return res.send({
		message: 'Successfully regenerated file thumbnail'
	});
};
