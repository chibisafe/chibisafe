import type { FastifyRequest, FastifyReply } from 'fastify';
import prisma from '../../../../structures/database';

interface body {
	ip: string;
}

export const middlewares = ['auth', 'admin'];

export const run = async (req: FastifyRequest, res: FastifyReply) => {
	if (!req.body) return res.status(400).send({ message: 'No body provided' });
	// const { username, password }: { username: string; password: string } = req.body;
	const { ip } = req.body as body;
	if (!ip) return res.status(400).send({ message: 'No ip provided' });

	const record = await prisma.bans.findFirst({
		where: {
			ip
		}
	});

	if (record) {
		await prisma.bans.delete({
			where: {
				id: record.id
			}
		});
	}

	return res.send({
		message: 'Successfully unbanned the ip'
	});
};
