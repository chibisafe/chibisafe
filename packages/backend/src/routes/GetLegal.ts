import type { FastifyReply } from 'fastify';
import { z } from 'zod';
import type { RequestWithUser } from '@/structures/interfaces.js';
import { SETTINGS } from '@/structures/settings.js';

export const schema = {
	summary: 'Get settings',
	describe: 'Get the current settings of the instance',
	tags: ['Server'],
	response: {
		200: z.object({
			content: z.string().optional().describe('Contents of the page.')
		})
	}
};

export const options = {
	url: '/legal/:section',
	method: 'get'
};

export const run = (req: RequestWithUser, res: FastifyReply) => {
	const { section } = req.params as { section: string };
	if (section === 'privacy') return res.send({ content: SETTINGS.privacyPolicyPageContent });
	else if (section === 'terms') return res.send({ content: SETTINGS.termsOfServicePageContent });
	else if (section === 'rules') return res.send({ content: SETTINGS.rulesPageContent });
	else return res.status(404).send({ message: 'Not found' });
};
