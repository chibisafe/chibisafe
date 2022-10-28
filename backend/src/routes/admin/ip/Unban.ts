import type { Request, Response } from 'hyper-express';
import prisma from '../../../structures/database';
import log from '../../../utils/Log';

export const options = {
	url: '/admin/ip/unban',
	method: 'post',
	middlewares: ['auth', 'admin']
};

export const run = async (req: Request, res: Response) => {
	const { ip }: { ip: string } = await req.json();

	if (!ip) return res.status(400).json({ message: 'No ip provided' });

	const record = await prisma.bans.findFirst({
		where: {
			ip
		}
	});

	if (!record) return res.status(400).json({ message: 'IP is not banned' });

	if (record) {
		await prisma.bans.delete({
			where: {
				id: record.id
			}
		});
	}

	log.warn(`IP ${ip} has been unbanned`);

	return res.json({
		message: 'Successfully unbanned the ip'
	});
};
