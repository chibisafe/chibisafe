import type { FastifyReply } from 'fastify';
import process from 'node:process';
import type { RequestWithUser } from '@/structures/interfaces';
import prisma from '@/structures/database';
import type { SETTINGS } from '@/structures/settings';
import { loadSettings } from '@/structures/settings';
import { getHtmlBuffer } from '@/main';

export const options = {
	url: '/admin/service/settings',
	method: 'post',
	middlewares: ['auth', 'admin']
};

type incomingSettings = {
	key: string;
	value: string;
	type: string;
};

export const run = async (req: RequestWithUser, res: FastifyReply) => {
	const { settings }: { settings: string } = req.body as { settings: string };

	try {
		// TODO: Validation of the settings
		const parsedSettings: Partial<typeof SETTINGS> = {};
		for (const item of settings as unknown as incomingSettings[]) {
			if (item.type === 'boolean') parsedSettings[item.key] = item.value === 'true';
			else if (item.type === 'number') parsedSettings[item.key] = Number(item.value);
			else parsedSettings[item.key] = item.value;
		}

		// @ts-expect-error chunkSize is a string on the db, but int here.
		parsedSettings.chunkSize = String(parsedSettings.chunkSize);
		// @ts-expect-error maxSize is a string on the db, but int here.
		parsedSettings.maxSize = String(parsedSettings.maxSize);
		// @ts-expect-error blockedExtensions is a string on the db, but array here.
		parsedSettings.blockedExtensions = JSON.stringify(parsedSettings.blockedExtensions);

		await prisma.settings.update({
			where: {
				id: 1
			},
			// @ts-ignore
			data: {
				...parsedSettings
			}
		});

		await res.send({ message: 'Settings updated' });
		// Refresh the instance settings
		await loadSettings(true);
		// If running in production, we need to update the html buffer
		if (process.env.NODE_ENV === 'production') await getHtmlBuffer();
	} catch (error) {
		req.log.error(error);
		res.internalServerError(error as string);
	}
};
