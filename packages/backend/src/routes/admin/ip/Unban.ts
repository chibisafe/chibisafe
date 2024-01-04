import type { FastifyRequest, FastifyReply } from 'fastify';
import prisma from '@/structures/database.js';

export const options = {
	url: '/admin/ip/unban',
	method: 'post',
	middlewares: ['apiKey', 'auth', 'admin']
};

export const run = async (req: FastifyRequest, res: FastifyReply) => {
	const { ip }: { ip: string } = req.body as { ip: string };

	if (!ip) {
		void res.badRequest('No ip provided');
		return;
	}

	const record = await prisma.bans.findFirst({
		where: {
			ip
		}
	});

	if (!record) {
		void res.badRequest('IP is not banned');
		return;
	}

	if (record) {
		await prisma.bans.delete({
			where: {
				id: record.id
			}
		});
	}

	res.log.warn(`IP ${ip} has been unbanned`);

	return res.send({
		message: 'Successfully unbanned the ip'
	});
};
