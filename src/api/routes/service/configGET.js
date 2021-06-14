const Route = require('../../structures/Route');
const Util = require('../../utils/Util');

class configGET extends Route {
	constructor() {
		super('/service/config', 'get', { adminOnly: true });
	}

	run(req, res) {
		return res.json({
			message: 'Successfully retrieved config',
			config: {
				serviceName: Util.config.serviceName,
				maxUploadSize: Util.config.maxSize,
				filenameLength: Util.config.generatedFilenameLength,
				albumLinkLength: Util.config.generatedAlbumLength,
				generateZips: Util.config.generateZips,
				publicMode: Util.config.publicMode,
				enableAccounts: Util.config.userAccounts
			}
		});
	}
}

module.exports = configGET;
