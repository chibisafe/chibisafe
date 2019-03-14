const Route = require('../../structures/Route');
const Util = require('../../utils/Util');

class albumGET extends Route {
	constructor() {
		super('/album/:id/full', 'get');
	}

	async run(req, res, db, user) {
		const { id } = req.params;
		if (!id) return res.status(400).json({ message: 'Invalid id supplied' });

		const album = await db.table('albums').where({ id, userId: user.id }).first();
		if (!album) return res.status(404).json({ message: 'Album not found' });

		/*
			Grab the files in a very unoptimized way. (This should be a join between both tables)
		*/
		const fileList = await db.table('albumsFiles').where('albumId', id).select('fileId');
		const fileIds = fileList.map(el => el.fileId);
		const files = await db.table('files')
			.whereIn('id', fileIds)
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
			file = Util.constructFilePublicLink(file);
		}

		return res.json({
			message: 'Successfully retrieved album',
			name: album.name,
			files
		});
	}
}

module.exports = albumGET;
