import { URL, fileURLToPath } from 'node:url';
import type { FastifyReply, FastifyRequest } from 'fastify';
import prisma from '@/structures/database.js';

export const getOriginalFile = async (req: FastifyRequest, res: FastifyReply) => {
	const { uuid } = req.params as { uuid: string };
	const file = await prisma.files.findUnique({ where: { uuid } });

	if (!file) {
		void res.notFound();
		return;
	}

	const { original, name } = file;

	const root = fileURLToPath(new URL('../../../../uploads', import.meta.url));

	return res.header('Content-Disposition', `inline; filename="${original}"`).sendFile(name, root);
};
