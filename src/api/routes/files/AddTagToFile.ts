import type { Response } from 'hyper-express';
import prisma from '../../structures/database';
import { RequestWithUser } from '../../structures/interfaces';

export const options = {
	url: '/file/:uuid/tag/:tagUuid',
	method: 'post',
	middlewares: ['auth']
};

export const run = async (req: RequestWithUser, res: Response) => {
	const { uuid, tagUuid } = req.path_parameters;
	if (!uuid || !tagUuid) return res.status(400).json({ message: 'No uuid or tagUuid provided' });

	const fileExists = await prisma.files.findFirst({
		where: {
			uuid,
			userId: req.user.id
		}
	});

	if (!fileExists) return res.status(401).json({ message: "File doesn't exist or doesn't belong to the user" });

	const tagExists = await prisma.tags.findFirst({
		where: {
			uuid: tagUuid,
			userId: req.user.id
		}
	});

	if (!tagExists) return res.status(401).json({ message: "Tag doesn't exist or doesn't belong to the user" });

	const relationExists = await prisma.fileTags.findFirst({
		where: {
			fileId: fileExists.id,
			tagId: tagExists.id
		}
	});

	if (relationExists) return res.status(400).json({ message: 'The file already has this tag' });

	await prisma.fileTags.create({
		data: {
			fileId: fileExists.id,
			tagId: tagExists.id
		}
	});

	return res.json({
		message: 'Successfully added tag to file'
	});
};
