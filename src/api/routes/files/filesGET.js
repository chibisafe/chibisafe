const Route = require('../../structures/Route');
const Util = require('../../utils/Util');

class filesGET extends Route {
	constructor() {
		super('/files', 'get');
	}

	async run(req, res, db, user) {
		let count = 0;

		let files = db.table('files')
			.where({ userId: user.id })
			.orderBy('createdAt', 'desc');

		const { page, limit = 100 } = req.query;
		if (page && page >= 0) {
			files = await files.offset((page - 1) * limit).limit(limit);

			const dbRes = await db.table('files')
				.count('* as count')
				.where({ userId: user.id })
				.first();

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
			files,
			count
		});
	}
}

module.exports = filesGET;
