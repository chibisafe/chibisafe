import type { FastifyReply } from 'fastify';
import type { RequestWithUser } from '@/structures/interfaces.js';
import { SETTINGS, getSettingsMeta } from '@/structures/settings.js';

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
