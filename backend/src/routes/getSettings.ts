import type { Response } from 'hyper-express';
import type { RequestWithUser } from '../structures/interfaces';
import { SETTINGS } from '../structures/settings';

export const options = {
	url: '/settings',
	method: 'get'
};

export const run = (req: RequestWithUser, res: Response) =>
	res.json({
		message: 'Successfully retrieved settings',
		settings: {
			serviceName: SETTINGS.serviceName,
			chunkSize: SETTINGS.chunkSize,
			maxFileSize: SETTINGS.maxSize,
			logo: SETTINGS.logoURL,
			background: SETTINGS.backgroundImageURL
		}
	});
