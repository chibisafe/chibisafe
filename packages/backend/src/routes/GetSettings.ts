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
			serviceName: z.string().describe('The name of the service.'),
			chunkSize: z.number().describe('The size of each chunk in bytes.'),
			maxSize: z.number().describe('The maximum size of a file in bytes.'),
			logoURL: z.string().describe('The URL of the logo.'),
			backgroundImageURL: z.string().describe('The URL of the background image.'),
			publicMode: z.boolean().describe('Whether or not the service is in public mode.'),
			userAccounts: z.boolean().describe('Whether or not user accounts are enabled.'),
			blockedExtensions: z.array(z.string()).describe('The list of blocked extensions.'),
			useNetworkStorage: z.boolean().describe('Whether or not network storage is enabled.')
		})
	}
};

export const options = {
	url: '/settings',
	method: 'get'
};

export const run = (_: RequestWithUser, res: FastifyReply) => {
	return res.send({
		serviceName: SETTINGS.serviceName,
		chunkSize: SETTINGS.chunkSize,
		maxSize: SETTINGS.maxSize,
		logoURL: SETTINGS.logoURL,
		backgroundImageURL: SETTINGS.backgroundImageURL,
		publicMode: SETTINGS.publicMode,
		userAccounts: SETTINGS.userAccounts,
		blockedExtensions: SETTINGS.blockedExtensions,
		useNetworkStorage: SETTINGS.useNetworkStorage
	});
};
