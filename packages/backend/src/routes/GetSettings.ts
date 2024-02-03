import type { FastifyReply } from 'fastify';
import type { RequestWithUser } from '@/structures/interfaces.js';
import { SETTINGS } from '@/structures/settings.js';

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
