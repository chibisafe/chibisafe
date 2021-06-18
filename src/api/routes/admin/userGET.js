const Route = require('../../structures/Route');
const Util = require('../../utils/Util');

class usersGET extends Route {
	constructor() {
		super('/admin/users/:id', 'get', { adminOnly: true });
	}

	async run(req, res, db) {
		const { id } = req.params;
		if (!id) return res.status(400).json({ message: 'Invalid user ID supplied' });

		try {
			const user = await db.table('users')
				.select('id', 'username', 'enabled', 'createdAt', 'editedAt', 'apiKeyEditedAt', 'isAdmin')
				.where({ id })
				.first();

			let count = 0;
			let files = db.table('files')
				.where({ userId: user.id })
				.orderBy('id', 'desc');

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

			for (let file of files) {
				file = Util.constructFilePublicLink(req, file);
			}

			return res.json({
				message: 'Successfully retrieved user',
				user,
				files,
				count
			});
		} catch (error) {
			return super.error(res, error);
		}
	}
}

module.exports = usersGET;
