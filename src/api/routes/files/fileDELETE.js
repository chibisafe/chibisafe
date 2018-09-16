const Route = require('../../structures/Route');
const config = require('../../../../config');
const db = require('knex')(config.server.database);
const Util = require('../../utils/Util');
const log = require('../../utils/Log');

class fileDELETE extends Route {
	constructor() {
		super('/file/:id', 'delete');
	}

	async run(req, res, user) {
		const { id } = req.params;
		if (!id) return res.status(400).json({ message: 'Invalid file ID supplied' });

		const file = await db.table('files').where({
			id,
			userId: user.id
		}).first();

		if (!file) return res.status(400).json({ message: 'The file doesn\'t exist or doesn\'t belong to the user' });
		try {
			await Util.deleteFile(file.name, true);
			return res.json({ message: 'The file was deleted successfully' });
		} catch (error) {
			log.error(error);
			return res.json({ message: 'There was a problem deleting the file' });
		}
	}
}

module.exports = fileDELETE;
