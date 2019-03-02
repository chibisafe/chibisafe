const Route = require('../../structures/Route');
const log = require('../../utils/Log');
const bcrypt = require('bcrypt');
const moment = require('moment');

class changePasswordPOST extends Route {
	constructor() {
		super('/user/password/change', 'post');
	}

	async run(req, res, db, user) {
		if (!req.body) return res.status(400).json({ message: 'No body provided' });
		const { password, newPassword } = req.body;
		if (!password || !newPassword) return res.status(401).json({ message: 'Invalid body provided' });
		if (password === newPassword) return res.status(400).json({ message: 'Passwords have to be different' });

		/*
			Checks if the password is right
		*/
		const comparePassword = await bcrypt.compare(password, user.password);
		if (!comparePassword) return res.status(401).json({ message: 'Current password is incorrect' });

		if (newPassword.length < 6 || newPassword.length > 64) {
			return res.status(400).json({ message: 'Password must have 6-64 characters' });
		}

		let hash;
		try {
			hash = await bcrypt.hash(newPassword, 10);
		} catch (error) {
			log.error('Error generating password hash');
			log.error(error);
			return res.status(401).json({ message: 'There was a problem processing your account' });
		}

		const now = moment.utc().toDate();
		await db.table('users').where('id', user.id).update({
			password: hash,
			passwordEditedAt: now
		});

		return res.json({ message: 'The password was changed successfully' });
	}
}

module.exports = changePasswordPOST;
