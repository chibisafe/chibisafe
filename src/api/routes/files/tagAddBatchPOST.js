const Route = require('../../structures/Route');

class tagAddBatchPOST extends Route {
	constructor() {
		super('/file/tag/addBatch', 'post');
	}

	async run(req, res, db, user) {
		if (!req.body) return res.status(400).json({ message: 'No body provided' });
		const { fileId, tagNames } = req.body;
		if (!fileId || !tagNames.length) return res.status(400).json({ message: 'No tags provided' });

		// Make sure the file belongs to the user
		const file = await db.table('files').where({ id: fileId, userId: user.id }).first();
		if (!file) return res.status(400).json({ message: 'File doesn\'t exist.' });

		const errors = {};
		const addedTags = [];
		for await (const tagName of tagNames) {
			try {
				const tag = await db.table('tags').where({ name: tagName, userId: user.id }).first();
				if (!tag) throw new Error('Tag doesn\'t exist in the database');
				await db.table('fileTags').insert({ fileId, tagId: tag.id });

				addedTags.push(tag);
			} catch (e) {
				errors[tagName] = e.message;
			}
		}

		return res.json({
			message: 'Successfully added tags to file',
			data: { fileId, tags: addedTags },
			errors,
		});
		// eslint-disable-next-line consistent-return
	}
}

module.exports = tagAddBatchPOST;
