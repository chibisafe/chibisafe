import type { FastifyRequest, FastifyReply } from 'fastify';
import prisma from '@/structures/database.js';
import { purgeUserFiles } from '@/utils/File.js';

export const options = {
	url: '/admin/user/:uuid/purge',
	method: 'post',
	middlewares: ['apiKey', 'auth', 'admin']
};

export const run = async (req: FastifyRequest, res: FastifyReply) => {
	const { uuid } = req.params as { uuid?: string };
	if (!uuid) {
		void res.badRequest('Invalid uuid supplied');
		return;
	}

	const user = await prisma.users.findUnique({
		where: {
			uuid
		}
	});

	if (!user) {
		void res.badRequest('User not found');
		return;
	}

	await purgeUserFiles(user.id);

	await prisma.albums.deleteMany({
		where: {
			userId: user.id
		}
	});

	await prisma.tags.deleteMany({
		where: {
			userId: user.id
		}
	});

	await prisma.snippets.deleteMany({
		where: {
			userId: user.id
		}
	});

	return res.send({
		message: "Successfully purged user's files, albums, tags and snippets"
	});
};
