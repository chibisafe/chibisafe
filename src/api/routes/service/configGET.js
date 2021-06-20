const Route = require('../../structures/Route');
const Util = require('../../utils/Util');

class configGET extends Route {
	constructor() {
		super('/service/config', 'get', { bypassAuth: true });
	}

	run(req, res) {
		return res.json({
			message: 'Successfully retrieved config',
			config: {
				version: process.env.npm_package_version,
				serviceName: Util.config.serviceName,
				maxUploadSize: Util.config.maxSize,
				filenameLength: Util.config.generatedFilenameLength,
				albumLinkLength: Util.config.generatedAlbumLength,
				chunkSize: Util.config.chunkSize,
				publicMode: Util.config.publicMode,
				userAccounts: Util.config.userAccounts,
				metaThemeColor: Util.config.metaThemeColor,
				metaDescription: Util.config.metaDescription,
				metaKeywords: Util.config.metaKeywords,
				metaTwitterHandle: Util.metaTwitterHandle
			}
		});
	}
}

module.exports = configGET;
