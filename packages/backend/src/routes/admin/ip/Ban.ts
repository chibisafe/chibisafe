import type { FastifyRequest, FastifyReply } from 'fastify';
import prisma from '@/structures/database';

export const options = {
	url: '/admin/ip/ban',
	method: 'post',
	middlewares: ['auth', 'admin']
};

export const run = async (req: FastifyRequest, res: FastifyReply) => {
	const { ip }: { ip: string } = req.body as { ip: string };

	if (!ip) {
		res.badRequest('No ip provided');
		return;
	}

	const found = await prisma.bans.findFirst({
		where: {
			ip
		}
	});

	if (found) {
		res.badRequest('IP is already banned');
		return;
	}

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
