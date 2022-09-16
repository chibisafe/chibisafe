import type { Request, Response } from 'hyper-express';
import prisma from '../../../structures/database';
import log from '../../../utils/Log';

export const url = '/admin/ip/unban';
export const method = 'POST';
export const middlewares = ['auth', 'admin'];

export const run = async (req: Request, res: Response) => {
	if (!req.body) return res.status(400).json({ message: 'No body provided' });

	const { ip }: { ip: string } = await req.json();

	if (!ip) return res.status(400).json({ message: 'No ip provided' });

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

	log.warn(`IP ${ip} has been unbanned`);

	return res.json({
		message: 'Successfully unbanned the ip'
	});
};
