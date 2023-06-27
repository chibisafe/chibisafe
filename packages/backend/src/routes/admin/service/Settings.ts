import type { FastifyReply } from 'fastify';
import type { RequestWithUser } from '@/structures/interfaces';

import { SETTINGS } from '@/structures/settings';

export const options = {
	url: '/admin/service/settings',
	method: 'get',
	middlewares: ['auth', 'admin']
};

export const run = async (req: RequestWithUser, res: FastifyReply) => {
	const settings: Partial<typeof SETTINGS> = SETTINGS;
	// These 2 will never be changed from the panel as they can prevent access to the panel
	delete settings.port;
	delete settings.host;

	// These 2 I'm lazy atm
	delete settings.statisticsCron;
	delete settings.enabledStatistics;

	const settingsWithTypes = [];

	// eslint-disable-next-line guard-for-in
	for (const key in settings) {
		settingsWithTypes.push({
			name: key,
			value: settings[key],
			type: typeof settings[key]
		});
	}

	return res.send({ settings: settingsWithTypes });
};
