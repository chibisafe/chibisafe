const searchQuery = require('search-query-parser');
const chrono = require('chrono-node');
const Route = require('../../structures/Route');

const options = { keywords: ['album', 'tag', 'user', 'before', 'after'], offsets: false };
class configGET extends Route {
	constructor() {
		super('/search/:q', 'get', { bypassAuth: true });
	}

	run(req, res) {
		const { q } = req.params;
		const parsed = searchQuery.parse(q, options);

		if (parsed.before) {
			parsed.before = chrono.parse(parsed.before);
		}
		if (parsed.after) {
			parsed.after = chrono.parse(parsed.after);
		}
		return res.json(parsed);
	}
}

module.exports = configGET;
