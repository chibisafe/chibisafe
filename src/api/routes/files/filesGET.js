const Route = require('../../structures/Route');
const Util = require('../../utils/Util');

class filesGET extends Route {
	constructor() {
		super('/files', 'get');
	}

	async run(req, res, db, user) {
		/*
			Get all the files from the user
		*/
		const files = await db.table('files')
			.where('userId', user.id)
			.orderBy('id', 'desc');

		for (const file of files) {
			file.albums = [];
			const albumFiles = await db.table('albumsFiles')
				.where('fileId', file.id);
			if (!albumFiles.length) continue;

			for (const albumFile of albumFiles) {
				const album = await db.table('albums')
					.where('id', albumFile.albumId)
					.select('id', 'name')
					.first();
				if (!album) continue;
				file.albums.push(album);
			}
		}
		/*
			For each file, create the public link to be able to display the file
		*/
		for (let file of files) {
			console.log(file);
			file = Util.constructFilePublicLink(file);
		}

		return res.json({
			message: 'Successfully retrieved files',
			files
		});
	}
}

module.exports = filesGET;
