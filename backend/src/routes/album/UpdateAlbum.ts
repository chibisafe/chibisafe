import type { Response } from 'hyper-express';
import prisma from '../../structures/database';
import type { RequestWithUser } from '../../structures/interfaces';

export const options = {
	url: '/album/:uuid/edit',
	method: 'post',
	middlewares: ['auth']
};

export const run = async (req: RequestWithUser, res: Response) => {
	const { uuid } = req.path_parameters;
	if (!uuid) return res.status(400).json({ message: 'Invalid uuid supplied' });

	const { name, nsfw } = await req.json();
	if (!name && nsfw === undefined) return res.status(400).json({ message: 'No data supplied' });

	// Make sure the album exists and belongs to the user
	const album = await prisma.albums.findFirst({
		where: {
			uuid,
			userId: req.user.id
		}
	});

	if (!album) return res.status(400).json({ message: "The album doesn't exist or doesn't belong to the user" });

	console.log('nsfw', nsfw);
	const updateObj = {
		name: name || album.name,
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

	return res.json({
		message: 'Successfully edited the album'
	});
};
