import process from 'node:process';
import type { FastifyRequest } from 'fastify';
import randomstring from 'randomstring';
import prisma from '@/structures/database.js';
import { SETTINGS } from '@/structures/settings.js';
import { log } from '@/utils/Logger.js';
import { getHost } from './Util.js';

const fileIdentifierMaxTries = 5;

export const getUniqueSnippetIdentifier = async (): Promise<string | null> => {
	const options = {
		length: SETTINGS.generatedFilenameLength
	};

	if (!SETTINGS.enableMixedCaseFilenames || process.platform === 'win32') {
		// @ts-ignore
		options.capitalization = 'lowercase';
	}

	for (let i = 0; i < fileIdentifierMaxTries; i++) {
		const identifier = randomstring.generate(options);

		const exists = await prisma.$queryRaw<{ id: number }[]>`
		SELECT id from snippets
		WHERE identifier LIKE ${`${identifier}.%`}
		LIMIT 1;
	`;

		if (!exists.length) {
			return identifier;
		}
	}

	log.error('Couldnt allocate identifier for snippet');
	return null;
};

export const constructSnippetPublicLink = (req: FastifyRequest, identifier: string) => {
	const host = SETTINGS.serveUploadsFrom ? SETTINGS.serveUploadsFrom : getHost(req);
	let frontendHost = host;
	if (process.env.NODE_ENV !== 'production') {
		frontendHost = host.replace(String(SETTINGS.port), '8001');
	}

	return {
		raw: `${host}/api/snippet/${identifier}/raw`,
		link: `${frontendHost}/s/${identifier}`
	};
};
