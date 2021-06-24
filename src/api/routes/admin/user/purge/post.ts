import type { FastifyRequest, FastifyReply } from 'fastify';
import { deleteAllFilesFromUser } from '../../../../utils/Util';

interface body {
	id: number;
}

export const middlewares = ['auth', 'admin'];

export const run = async (req: FastifyRequest, res: FastifyReply) => {
	if (!req.body) return res.status(400).send({ message: 'No body provided' });
	const { id } = req.body as body;
	if (!id) return res.status(400).send({ message: 'No id provided' });

	await deleteAllFilesFromUser(id);

	return res.send({
		message: 'Successfully demoted user'
	});
};
