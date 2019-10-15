const Route = require('../../structures/Route');

class banIP extends Route {
	constructor() {
		super('/admin/ban/ip', 'post', { adminOnly: true });
	}

	async run(req, res, db) {
		if (!req.body) return res.status(400).json({ message: 'No body provided' });
		const { ip } = req.body;
		if (!ip) return res.status(400).json({ message: 'No ip provided' });

		try {
			await db.table('bans').insert({ ip });
		} catch (error) {
			return super.error(res, error);
		}

		return res.json({
			message: 'Successfully banned the ip'
		});
	}
}

module.exports = banIP;
