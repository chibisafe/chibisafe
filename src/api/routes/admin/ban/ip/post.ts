import type { Request, Response } from 'hyper-express';
import prisma from '../../../../structures/database';

interface body {
	ip: string;
}
export const middlewares = ['auth', 'admin'];
export const run = async (req: Request, res: Response) => {
	if (!req.body) return res.status(400).json({ message: 'No body provided' });

	const { ip } = req.body as body;
	if (!ip) return res.status(400).json({ message: 'No ip provided' });

	await prisma.bans.create({
		data: {
			ip
		}
	});

	return res.json({
		message: 'Successfully banned the ip'
	});
};
