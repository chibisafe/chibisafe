const Route = require('../../structures/Route');
const Util = require('../../utils/Util');

class userDemote extends Route {
	constructor() {
		super('/admin/users/purge', 'post', { adminOnly: true });
	}

	async run(req, res) {
		if (!req.body) return res.status(400).json({ message: 'No body provided' });
		const { id } = req.body;
		if (!id) return res.status(400).json({ message: 'No id provided' });

		try {
			await Util.deleteAllFilesFromUser(id);
		} catch (error) {
			return super.error(res, error);
		}

		return res.json({
			message: 'Successfully deleted the user\'s files'
		});
	}
}

module.exports = userDemote;
