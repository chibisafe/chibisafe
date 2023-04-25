import type { FastifyRequest, FastifyReply } from 'fastify';
import prisma from '../../../structures/database';
import log from '../../../utils/Log';

export const options = {
	url: '/admin/ip/unban',
	method: 'post',
	middlewares: ['auth', 'admin']
};

export const run = async (req: FastifyRequest, res: FastifyReply) => {
	const { ip }: { ip: string } = req.body as { ip: string };

	if (!ip) return res.code(400).send({ message: 'No ip provided' });

	const record = await prisma.bans.findFirst({
		where: {
			ip
		}
	});

	if (!record) return res.code(400).send({ message: 'IP is not banned' });

	if (record) {
		await prisma.bans.delete({
			where: {
				id: record.id
			}
		});
	}

	log.warn(`IP ${ip} has been unbanned`);

	return res.send({
		message: 'Successfully unbanned the ip'
	});
};
