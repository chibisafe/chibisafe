const Route = require('../../structures/Route');

class configGET extends Route {
	constructor() {
		super('/service/config', 'get', { adminOnly: true });
	}

	run(req, res) {
		return res.json({
			message: 'Successfully retrieved config',
			config: {
				serviceName: process.env.SERVICE_NAME,
				uploadFolder: process.env.UPLOAD_FOLDER,
				linksPerAlbum: parseInt(process.env.MAX_LINKS_PER_ALBUM, 10),
				maxUploadSize: parseInt(process.env.MAX_SIZE, 10),
				filenameLength: parseInt(process.env.GENERATED_FILENAME_LENGTH, 10),
				albumLinkLength: parseInt(process.env.GENERATED_ALBUM_LENGTH, 10),
				generateThumbnails: process.env.GENERATE_THUMBNAILS === 'true',
				generateZips: process.env.GENERATE_ZIPS === 'true',
				publicMode: process.env.PUBLIC_MODE === 'true',
				enableAccounts: process.env.USER_ACCOUNTS === 'true',
			},
		});
	}
}

module.exports = configGET;
