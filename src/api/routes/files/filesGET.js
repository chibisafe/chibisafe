const Route = require('../../structures/Route');
const Util = require('../../utils/Util');

class filesGET extends Route {
	constructor() {
		super('/files', 'get');
	}

	async run(req, res, db, user) {
		// Get all the files from the user
		const files = await db.table('files')
			.where('userId', user.id)
			.orderBy('id', 'desc');

		// For each file, create the public link to be able to display the file
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
