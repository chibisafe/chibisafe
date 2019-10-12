const Route = require('../../structures/Route');
const Util = require('../../utils/Util');

class filesGET extends Route {
	constructor() {
		super('/file/:id', 'get', { adminOnly: true });
	}

	async run(req, res, db) {
		const { id } = req.params;
		if (!id) return res.status(400).json({ message: 'Invalid file ID supplied' });

		let file = await db.table('files').where({ id }).first();
		const user = await db.table('users').where({ id: file.userId }).first();
		file = Util.constructFilePublicLink(file);

		// Additional relevant data
		const filesFromUser = await db.table('files').where({ userId: user.id }).select('id');
		user.fileCount = filesFromUser.length;

		return res.json({
			message: 'Successfully retrieved file',
			file,
			user
		});
	}
}

module.exports = filesGET;
