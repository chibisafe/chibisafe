import type { FastifyRequest, FastifyReply } from 'fastify';
import prisma from '@/structures/database.js';

export const options = {
	url: '/admin/ip/ban',
	method: 'post',
	middlewares: ['apiKey', 'auth', 'admin']
};

export const run = async (req: FastifyRequest, res: FastifyReply) => {
	const { ip }: { ip: string } = req.body as { ip: string };

	if (!ip) {
		void res.badRequest('No ip provided');
		return;
	}

	const found = await prisma.bans.findFirst({
		where: {
			ip
		}
	});

	if (found) {
		void res.badRequest('IP is already banned');
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
