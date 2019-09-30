const Route = require('../../structures/Route');

class tagAddPOST extends Route {
	constructor() {
		super('/file/tag/add', 'post');
	}

	run(req, res, db) {
		if (!req.body) return res.status(400).json({ message: 'No body provided' });
		const { fileId, tagNames } = req.body;
		if (!fileId || !tagNames.length) return res.status(400).json({ message: 'No tags provided' });

		tagNames.forEach(async tag => {
			try {
				await db.table('fileTags').insert({ fileId, tag });
			} catch (error) {
				return super.error(res, error);
			}
		});

		return res.json({
			message: 'Successfully added file to album'
		});
	}
}

module.exports = tagAddPOST;
