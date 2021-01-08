const Route = require('../../structures/Route');
const StatsGenerator = require('../../utils/StatsGenerator');
const moment = require('moment');

// Thank you Bobby for the stats code https://github.com/BobbyWibowo/lolisafe/blob/safe.fiery.me/controllers/utilsController.js
class filesGET extends Route {
	constructor() {
		super('/service/statistics/:category?', 'get', { adminOnly: true });
	}

	async run(req, res, db) {
		const { category } = req.params;
		if (category) {
			const dbRes = await StatsGenerator.statGenerators[category](db);
			return res.json({
				statistics: {
					[category]: {
						...dbRes,
						meta: {
							cached: false,
							generatedOn: moment().format('MMMM Do YYYY, h:mm:ss a z'),
							type: StatsGenerator.Type.HIDDEN
						}
					}
				}
			});
		}

		const cachedStats = await db('statistics')
			.select('type', 'data', 'batchId', 'createdAt')
			.where('batchId', '=', db('statistics').max('batchId'));

		let stats = cachedStats.reduce((acc, { type, data, createdAt }) => {
			try {
				// pg returns json, sqlite retuns a string...
				if (typeof data === 'string' || data instanceof String) {
					acc[type] = JSON.parse(data);
				} else {
					acc[type] = data;
				}

				acc[type].meta = {
					cached: true,
					generatedOn: moment(createdAt).format('MMMM Do YYYY, h:mm:ss a z'), // pg returns this as a date, sqlite3 returns an unix timestamp :<
					type: StatsGenerator.Type.HIDDEN
				};
			} catch (e) {
				console.error(e);
			}

			return acc;
		}, {});

		stats = { ...stats, ...(await StatsGenerator.getMissingStats(db, Object.keys(stats))) };

		const ordered = StatsGenerator.keyOrder.reduce((acc, k) => {
			acc[k] = stats[k];
			return acc;
		}, {});

		return res.json({ statistics: ordered });
	}
}

module.exports = filesGET;
