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
			const user = await db.table('users').where({ id }).first();
			const files = await db.table('files')
				.where({ userId: user.id })
				.orderBy('id', 'desc');

			for (let file of files) {
				file = Util.constructFilePublicLink(file);
			}

			return res.json({
				message: 'Successfully retrieved user',
				user,
				files
			});
		} catch (error) {
			return super.error(res, error);
		}
	}
}

module.exports = usersGET;
