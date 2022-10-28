import type { Request, Response } from 'hyper-express';
import prisma from '../../../structures/database';
import log from '../../../utils/Log';

export const options = {
	url: '/admin/ip/ban',
	method: 'post',
	middlewares: ['auth', 'admin']
};

export const run = async (req: Request, res: Response) => {
	const { ip }: { ip: string } = await req.json();

	if (!ip) return res.status(400).json({ message: 'No ip provided' });

	const found = await prisma.bans.findFirst({
		where: {
			ip
		}
	});

	if (found) return res.status(400).json({ message: 'IP is already banned' });

	await prisma.bans.create({
		data: {
			ip
		}
	});

	log.warn(`IP ${ip} has been banned`);

	return res.json({
		message: 'Successfully banned the ip'
	});
};
