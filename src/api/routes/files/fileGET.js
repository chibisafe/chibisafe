const Route = require('../../structures/Route');
const Util = require('../../utils/Util');

class fileGET extends Route {
	constructor() {
		super('/file/:id', 'get');
	}

	async run(req, res, db, user) {
		const { id } = req.params;
		if (!id) return res.status(400).json({ message: 'Invalid file ID supplied' });

		/*
			Make sure the file exists
		*/
		let file = await db.table('files').where({ id, userId: user.id }).first();
		if (!file) return res.status(400).json({ message: 'The file doesn\'t exist or doesn\'t belong to the user' });

		file = Util.constructFilePublicLink(req, file);

		/*
			Fetch the albums
		*/
		const albums = await db.table('albumsFiles')
			.where('fileId', id)
			.join('albums', 'albums.id', 'albumsFiles.albumId')
			.select('albums.id', 'albums.name');

		/*
			Fetch the tags
		*/
		const tags = await db.table('fileTags')
			.where('fileId', id)
			.join('tags', 'tags.id', 'fileTags.tagId')
			.select('tags.id', 'tags.uuid', 'tags.name');

		return res.json({
			message: 'Successfully retrieved file',
			file,
			albums,
			tags
		});
	}
}

module.exports = fileGET;
