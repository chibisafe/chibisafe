import type { FastifyReply } from 'fastify';
import prisma from '@/structures/database.js';
import type { RequestWithUser } from '@/structures/interfaces.js';

export const options = {
	url: '/album/:uuid/edit',
	method: 'post',
	middlewares: ['apiKey', 'auth']
};

export const run = async (req: RequestWithUser, res: FastifyReply) => {
	const { uuid } = req.params as { uuid: string };

	const { name, nsfw, description } = req.body as { description?: string; name?: string; nsfw?: boolean };
	if (!name && nsfw === undefined && !description) {
		void res.badRequest('No data supplied');
		return;
	}

	// Make sure the album exists and belongs to the user
	const album = await prisma.albums.findFirst({
		where: {
			uuid,
			userId: req.user.id
		}
	});

	if (!album) {
		void res.notFound("The album doesn't exist or doesn't belong to the user");
		return;
	}

	const updateObj = {
		name: name ?? album.name,
		nsfw: nsfw === true ? true : nsfw === false ? false : album.nsfw,
		description: description ?? album.description
	};

	await prisma.albums.update({
		where: {
			uuid
		},
		data: {
			...updateObj
		}
	});

	return res.send({
		message: 'Successfully edited the album'
	});
};
