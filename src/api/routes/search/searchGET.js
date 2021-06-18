const searchQuery = require('search-query-parser');

const Route = require('../../structures/Route');
const Util = require('../../utils/Util');

const queryHelper = require('../../utils/QueryHelper');

const options = {
	keywords: ['album', 'tag', 'before', 'after', 'file'],
	offsets: false,
	alwaysArray: true,
	tokenize: true
};

class configGET extends Route {
	constructor() {
		super('/search/', 'get');
	}

	async run(req, res, db, user) {
		let count = 0;

		const { q, albumId } = req.query;
		const parsed = searchQuery.parse(q, options);

		let files = db.table('files')
			.select('*')
			.where({ 'files.userId': user.id })
			.orderBy('files.createdAt', 'desc');

		if (albumId) {
			files
				.join('albumsFiles', 'albumsFiles.fileId', 'files.id')
				.where({ albumId });
		}

		files = queryHelper.processQuery(db, files, parsed);

		// const query = files.toString();
		const { page, limit = 100 } = req.query;

		if (page && page >= 0) {
			let dbRes = files.clone(); // clone the query to attach a count to it later on
			files = await files.offset((page - 1) * limit).limit(limit);

			dbRes = await dbRes.count('* as count').first();

			count = dbRes.count;
		} else {
			files = await files; // execute the query
			count = files.length;
		}

		// For each file, create the public link to be able to display the file
		for (let file of files) {
			file = Util.constructFilePublicLink(req, file);
		}

		return res.json({
			message: 'Successfully retrieved files',
			// query,
			// parsed,
			files,
			count
		});
	}
}

module.exports = configGET;
