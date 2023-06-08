import type { FastifyRequest, FastifyReply } from 'fastify';
import prisma from '../../../structures/database';

export const options = {
	url: '/admin/ip/ban',
	method: 'post',
	middlewares: ['auth', 'admin']
};

export const run = async (req: FastifyRequest, res: FastifyReply) => {
	const { ip }: { ip: string } = req.body as { ip: string };

	if (!ip) return res.code(400).send({ message: 'No ip provided' });

	const found = await prisma.bans.findFirst({
		where: {
			ip
		}
	});

	if (found) return res.code(400).send({ message: 'IP is already banned' });

	await prisma.bans.create({
		data: {
			ip
		}
	});

	req.log.warn(`IP ${ip} has been banned`);

	return res.send({
		message: 'Successfully banned the ip'
	});
};
