const Route = require('../../structures/Route');

class unBanIP extends Route {
	constructor() {
		super('/admin/unban/ip', 'post', { adminOnly: true });
	}

	async run(req, res, db) {
		if (!req.body) return res.status(400).json({ message: 'No body provided' });
		const { ip } = req.body;
		if (!ip) return res.status(400).json({ message: 'No ip provided' });

		try {
			await db.table('bans')
				.where({ ip })
				.delete();
		} catch (error) {
			return super.error(res, error);
		}

		return res.json({
			message: 'Successfully unbanned the ip'
		});
	}
}

module.exports = unBanIP;
