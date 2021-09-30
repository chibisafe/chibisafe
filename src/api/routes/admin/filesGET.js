const Route = require('../../structures/Route');
const Util = require('../../utils/Util');

class filesGET extends Route {
	constructor() {
		super('/admin/uploads', 'get', { adminOnly: true });
	}

	async run(req, res, db) {
		try {
			let count = 0;
			let files = db.table('files')
				.where({ userId: null })
				.orderBy('id', 'desc');

			const { page, limit = 100 } = req.query;
			if (page && page >= 0) {
				files = await files.offset((page - 1) * limit).limit(limit);

				const dbRes = await db.table('files')
					.count('* as count')
					.where({ userId: null })
					.first();

				count = dbRes.count;
			} else {
				files = await files; // execute the query
				count = files.length;
			}

			for (let file of files) {
				file = Util.constructFilePublicLink(req, file);
			}

			return res.json({
				message: 'Successfully retrieved uploads',
				files,
				count
			});
		} catch (error) {
			return super.error(res, error);
		}
	}
}

module.exports = filesGET;
