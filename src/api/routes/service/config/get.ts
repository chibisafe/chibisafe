import type { FastifyReply } from 'fastify';
import type { RequestWithUser } from '../../../structures/interfaces';
import { getConfig } from '../../../utils/Util';

export const middlewares = ['auth', 'admin'];

export const run = async (req: RequestWithUser, res: FastifyReply) => {
	const config = await getConfig();

	return res.send({
		message: 'Successfully retrieved config',
		config: {
			version: process.env.npm_package_version,
			serviceName: config.serviceName,
			maxUploadSize: config.maxSize,
			filenameLength: config.generatedFilenameLength,
			albumLinkLength: config.generatedAlbumLength,
			chunkSize: config.chunkSize,
			publicMode: config.publicMode,
			userAccounts: config.userAccounts,
			metaThemeColor: config.metaThemeColor,
			metaDescription: config.metaDescription,
			metaKeywords: config.metaKeywords,
			metaTwitterHandle: config.metaTwitterHandle
		}
	});
};
