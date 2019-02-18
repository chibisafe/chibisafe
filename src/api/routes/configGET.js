const Route = require('../structures/Route');
const config = require('../../../config');

class configGET extends Route {
	constructor() {
		super('/config', 'get', { bypassAuth: true });
	}

	run(req, res) {
		return res.json({
			version: process.env.npm_package_version,
			URL: config.filesServeLocatio,
			baseURL: config.backendLocation,
			serviceName: config.serviceName,
			maxFileSize: config.uploads.uploadMaxSize,
			chunkSize: config.uploads.chunkSize,
			maxLinksPerAlbum: config.albums.maxLinksPerAlbum
		});
	}
}

module.exports = configGET;
