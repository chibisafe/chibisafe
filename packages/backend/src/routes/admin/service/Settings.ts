import type { FastifyReply } from 'fastify';
import { z } from 'zod';
import type { RequestWithUser } from '@/structures/interfaces.js';
import { http4xxErrorSchema } from '@/structures/schemas/HTTP4xxError.js';
import { http5xxErrorSchema } from '@/structures/schemas/HTTP5xxError.js';
import { SETTINGS, getSettingsMeta } from '@/structures/settings.js';

export const schema = {
	summary: 'Get settings',
	description: 'Returns the chibisafe instance settings',
	tags: ['Server'],
	response: {
		200: z.object({
			settings: z
				.array(
					z.object({
						name: z.string().describe('The name of the setting.'),
						key: z.string().describe('The key of the setting.'),
						value: z.any().describe('The value of the setting.'),
						type: z.string().describe('The type of the setting.'),
						description: z.string().describe('The description of the setting.'),
						notice: z.string().optional().describe('The notice of the setting, if any.'),
						example: z.string().optional().describe('An example value of the setting.'),
						category: z.string().optional().describe('The category of the setting.')
					})
				)
				.describe('All the chibisafe instance settings.')
		}),
		'4xx': http4xxErrorSchema,
		'5xx': http5xxErrorSchema
	}
};

export const options = {
	url: '/admin/service/settings',
	method: 'get',
	middlewares: ['apiKey', 'auth', 'admin']
};

export const run = async (_: RequestWithUser, res: FastifyReply) => {
	const settings: Partial<typeof SETTINGS> = SETTINGS;
	// These 2 will never be changed from the panel as they can prevent access to the panel
	delete settings.port;
	delete settings.host;

	// Settings not yet implemented
	delete settings.statisticsCron;
	delete settings.updateCheckCron;
	delete settings.enabledStatistics;
	delete settings.disableStatisticsCron;
	delete settings.chunkedUploadsTimeout;

	const settingsWithTypes = [];

	// eslint-disable-next-line guard-for-in
	for (const key in settings) {
		settingsWithTypes.push({
			...getSettingsMeta(key),
			key,
			value: settings[key]
		});
	}

	return res.send({ settings: settingsWithTypes });
};
