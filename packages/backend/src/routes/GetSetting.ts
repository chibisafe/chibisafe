import type { FastifyReply } from 'fastify';
import { z } from 'zod';
import type { RequestWithUser } from '@/structures/interfaces.js';
import { SETTINGS } from '@/structures/settings.js';

const publicSettings = [
	'serviceName',
	'metaDescription',
	'metaKeywords',
	'metaTwitterHandle',
	'metaDomain',
	'chunkSize',
	'maxSize',
	'logoURL',
	'backgroundImageURL',
	'publicMode',
	'userAccounts',
	'blockedExtensions',
	'useNetworkStorage',
	'useMinimalHomepage',
	'serveUploadsFrom',
	'useUrlShortener',
	'privacyPolicyPageContent',
	'termsOfServicePageContent',
	'rulesPageContent'
];

export const schema = {
	summary: 'Get setting',
	describe: 'Get the current value of a specific setting of the instance',
	tags: ['Server'],
	response: {
		200: z.object({
			value: z.any().optional().describe('The value of the requested setting key.')
		})
	}
};

export const options = {
	url: '/settings/:key',
	method: 'get',
	middlewares: [
		{
			name: 'auth',
			optional: true
		},
		{
			name: 'apiKey',
			optional: true
		}
	]
};

export const run = (req: RequestWithUser, res: FastifyReply) => {
	const { key } = req.params as { key: string };

	if (publicSettings.includes(key)) {
		return res.send({ value: SETTINGS[key] });
	}

	if (!req.user) return res.status(403).send({ message: 'Forbidden' });

	if (!req.user.roles.some(role => role.name === 'admin' || role.name === 'owner'))
		return res.status(403).send({ message: 'Forbidden' });

	if (!SETTINGS[key]) return res.status(404).send({ message: 'Setting not found' });
	return res.send({ value: SETTINGS[key] });
};
