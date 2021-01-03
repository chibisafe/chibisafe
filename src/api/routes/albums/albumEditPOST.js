const Route = require('../../structures/Route');

class albumEditPOST extends Route {
	constructor() {
		super('/album/edit', 'post');
	}

	async run(req, res, db, user) {
		if (!req.body) return res.status(400).json({ message: 'No body provided' });
		const { id, name, nsfw } = req.body;
		if (!id) return res.status(400).json({ message: 'Invalid album identifier supplied' });


		const album = await db.table('albums').where({ id, userId: user.id }).first();
		if (!album) return res.status(400).json({ message: 'The album doesn\'t exist or doesn\'t belong to the user' });

		try {
			const updateObj = {
				name: name || album.name,
				nsfw: nsfw === true ? true : nsfw === false ? false : album.nsfw
			};
			await db
				.table('albums')
				.where({ id })
				.update(updateObj);
			return res.json({ message: 'Editing the album was successful', data: updateObj });
		} catch (error) {
			return super.error(res, error);
		}
	}
}

module.exports = albumEditPOST;
