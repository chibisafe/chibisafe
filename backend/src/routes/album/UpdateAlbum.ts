import type { FastifyReply } from 'fastify';
import prisma from '../../structures/database';
import type { RequestWithUser } from '../../structures/interfaces';

export const options = {
	url: '/album/:uuid/edit',
	method: 'post',
	middlewares: ['auth']
};

export const run = async (req: RequestWithUser, res: FastifyReply) => {
	const { uuid } = req.params as { uuid?: string };
	if (!uuid) return res.code(400).send({ message: 'Invalid uuid supplied' });

	const { name, nsfw } = req.body as { name?: string; nsfw?: boolean };
	if (!name && nsfw === undefined) return res.code(400).send({ message: 'No data supplied' });

	// Make sure the album exists and belongs to the user
	const album = await prisma.albums.findFirst({
		where: {
			uuid,
			userId: req.user.id
		}
	});

	if (!album) return res.code(400).send({ message: "The album doesn't exist or doesn't belong to the user" });

	console.log('nsfw', nsfw);
	const updateObj = {
		name: name ?? album.name,
		nsfw: nsfw === true ? true : nsfw === false ? false : album.nsfw
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
