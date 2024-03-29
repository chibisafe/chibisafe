import type { FastifyReply } from 'fastify';
import { z } from 'zod';
import type { RequestWithUser } from '@/structures/interfaces.js';
import { http4xxErrorSchema } from '@/structures/schemas/HTTP4xxError.js';
import { http5xxErrorSchema } from '@/structures/schemas/HTTP5xxError.js';
import { cachedStats, getStats } from '@/utils/StatsGenerator.js';

export const schema = {
	summary: 'Get stats',
	description: 'Returns the current system stats',
	tags: ['Server'],
	response: {
		200: z.object({
			statistics: z.array(z.any()).describe('The statistics array.')
		}),
		'4xx': http4xxErrorSchema,
		'5xx': http5xxErrorSchema
	}
};

export const options = {
	url: '/admin/service/statistics',
	method: 'get',
	middlewares: ['apiKey', 'auth', 'admin']
};

export const run = async (req: RequestWithUser, res: FastifyReply) => {
	// Generate all stats categories, without forcing any
	// In practice, this will only generate "system" and "service" categories on-demand,
	// because the others would have been generated by scheduler
	// Consult StatsCategory.ts route for per-category on-demand refresh
	const { force } = req.query as { force?: boolean };
	await getStats(['system', 'service', 'fileSystems', 'uploads', 'users', 'albums'], force);

	const stats = Object.keys(cachedStats).map(name => ({
		[name]: {
			...cachedStats[name]?.cache,
			meta: {
				generatedOn: cachedStats[name]?.generatedOn
			}
		}
	}));

	return res.send({ statistics: stats });
};
