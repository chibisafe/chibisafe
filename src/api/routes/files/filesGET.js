const Route = require('../../structures/Route');
const config = require('../../../../config');
const db = require('knex')(config.server.database);
const Util = require('../../utils/Util');

class filesGET extends Route {
	constructor() {
		super('/files', 'get');
	}

	async run(req, res, user) {
		const files = await db.table('files')
			.where('userId', user.id)
			.orderBy('id', 'desc');
		for (let file of files) {
			file = Util.constructFilePublicLink(file);
		}
		return res.json({
			message: 'Successfully retrieved files',
			files
		});
	}
}

module.exports = filesGET;
