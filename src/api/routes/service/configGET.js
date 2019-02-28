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
				linksPerAlbum: process.env.MAX_LINKS_PER_ALBUM,
				maxUploadSize: process.env.MAX_SIZE,
				filenameLength: process.env.GENERATED_FILENAME_LENGTH,
				albumLinkLength: process.env.GENERATED_ALBUM_LENGTH,
				generateThumbnails: process.env.GENERATE_THUMBNAILS,
				generateZips: process.env.GENERATE_ZIPS,
				stripExif: process.env.STRIP_EXIF,
				publicMode: process.env.PUBLIC_MODE,
				enableAccounts: process.env.USER_ACCOUNTS
			}
		});
	}
}

module.exports = configGET;
