import process from 'node:process';
import type { FastifyRequest } from 'fastify';
import randomstring from 'randomstring';
import prisma from '@/structures/database.js';
import { SETTINGS } from '@/structures/settings.js';
import { log } from '@/utils/Logger.js';
import { getHost } from './Util.js';

const identifierMaxTries = 5;

export const getUniqueShortLinkIdentifier = async (): Promise<string | null> => {
	const options = {
		length: SETTINGS.generatedLinksLength
	};

	for (let i = 0; i < identifierMaxTries; i++) {
		const identifier = randomstring.generate(options);

		const exists = await prisma.$queryRaw<{ id: number }[]>`
		SELECT id from shortenedLinks
		WHERE identifier LIKE ${`${identifier}.%`}
		LIMIT 1;
	`;

		if (!exists.length) {
			return identifier;
		}
	}

	log.error('Couldnt allocate identifier for link');
	return null;
};

export const constructShortLink = (req: FastifyRequest, identifier: string) => {
	const host = SETTINGS.serveUploadsFrom ? SETTINGS.serveUploadsFrom : getHost(req);
	let frontendHost = host;
	if (process.env.NODE_ENV !== 'production') {
		frontendHost = host.replace(String(SETTINGS.port), '8001');
	}

	return `${frontendHost}/l/${identifier}`;
};
