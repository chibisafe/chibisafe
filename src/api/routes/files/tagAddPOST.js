const Route = require('../../structures/Route');

class tagAddPOST extends Route {
	constructor() {
		super('/file/tag/add', 'post');
	}

	async run(req, res, db, user) {
		if (!req.body) return res.status(400).json({ message: 'No body provided' });
		const { fileId, tagNames } = req.body;
		if (!fileId || !tagNames.length) return res.status(400).json({ message: 'No tags provided' });

		// Make sure the file belongs to the user
		const file = await db.table('files').where({ id: fileId, userId: user.id }).first();
		if (!file) return res.status(400).json({ message: 'File doesn\'t exist.' });

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
