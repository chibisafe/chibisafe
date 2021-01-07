const Route = require('../../structures/Route');
const StatsGenerator = require('../../utils/StatsGenerator');

// Thank you Bobby for the stats code https://github.com/BobbyWibowo/lolisafe/blob/safe.fiery.me/controllers/utilsController.js
class filesGET extends Route {
	constructor() {
		super('/service/statistics', 'get', { adminOnly: true });
	}

	async run(req, res, db) {
		const cachedStats = await db('statistics')
			.select('type', 'data', 'batchId')
			.where('batchId', '=', db('statistics').max('batchId'));

		let stats = cachedStats.reduce((acc, { type, data }) => {
			try {
				acc[type] = JSON.parse(data);
			} catch (e) {
				console.error(e);
			}

			return acc;
		}, {});

		stats = { ...stats, ...(await StatsGenerator.getMissingStats(db, Object.keys(stats))) };

		return res.json(StatsGenerator.keyOrder.reduce((acc, k) => {
			acc[k] = stats[k];
			return acc;
		}, {}));
	}
}

module.exports = filesGET;
