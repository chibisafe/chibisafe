const Route = require('../../structures/Route');

class tagAddPOST extends Route {
	constructor() {
		super('/file/tag/add', 'post');
	}

	async run(req, res, db, user) {
		if (!req.body) return res.status(400).json({ message: 'No body provided' });

		const { fileId, tagName } = req.body;
		if (!fileId || !tagName.length) return res.status(400).json({ message: 'No tag provided' });

		// Make sure the file belongs to the user
		const file = await db.table('files').where({ id: fileId, userId: user.id }).first();
		if (!file) return res.status(400).json({ message: 'File doesn\'t exist.' });

		// Make sure user has a tag like that
		const tag = await db.table('tags').where({ name: tagName, userId: user.id }).first();
		if (!tag) return res.status(400).json({ message: 'Tag doesn\'t exist. ' });

		try {
			await db.table('fileTags').insert({ fileId, tagId: tag.id });
		} catch (error) {
			return super.error(res, error);
		}

		return res.json({
			message: 'Successfully added tag to file',
			data: { fileId, tag },
		});
		// eslint-disable-next-line consistent-return
	}
}

module.exports = tagAddPOST;
