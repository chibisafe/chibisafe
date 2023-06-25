import type { FastifyReply } from 'fastify';
import type { RequestWithUser } from '@/structures/interfaces';
import { SETTINGS } from '@/structures/settings';

export const options = {
	url: '/settings',
	method: 'get'
};

export const run = (req: RequestWithUser, res: FastifyReply) =>
	res.send({
		serviceName: SETTINGS.serviceName,
		chunkSize: SETTINGS.chunkSize,
		maxSize: SETTINGS.maxSize,
		logoURL: SETTINGS.logoURL,
		backgroundImageURL: SETTINGS.backgroundImageURL,
		publicMode: SETTINGS.publicMode,
		userAccounts: SETTINGS.userAccounts
	});
