const path = require('path');
const config = require('../config.js');
const fs = require('fs');
const gm = require('gm');
const ffmpeg = require('fluent-ffmpeg');
const db = require('knex')(config.database);

const utilsController = {};
utilsController.imageExtensions = ['.jpg', '.jpeg', '.bmp', '.gif', '.png'];
utilsController.videoExtensions = ['.webm', '.mp4', '.wmv', '.avi', '.mov'];

utilsController.getPrettyDate = function(date) {
	return date.getFullYear() + '-'
		+ (date.getMonth() + 1) + '-'
		+ date.getDate() + ' '
		+ (date.getHours() < 10 ? '0' : '')
		+ date.getHours() + ':'
		+ (date.getMinutes() < 10 ? '0' : '')
		+ date.getMinutes() + ':'
		+ (date.getSeconds() < 10 ? '0' : '')
		+ date.getSeconds();
};

utilsController.authorize = async (req, res) => {
	const token = req.headers.token;
	if (token === undefined) return res.status(401).json({ success: false, description: 'No token provided' });

	const user = await db.table('users').where('token', token).first();
	if (!user) return res.status(401).json({ success: false, description: 'Invalid token' });
	return user;
};

utilsController.generateThumbs = function(file, basedomain) {
	if (config.uploads.generateThumbnails !== true) return;
	const ext = path.extname(file.name).toLowerCase();

	let thumbname = path.join(__dirname, '..', config.uploads.folder, 'thumbs', file.name.slice(0, -ext.length) + '.png');
	fs.access(thumbname, err => {
		if (err && err.code === 'ENOENT') {
			if (utilsController.videoExtensions.includes(ext)) {
				ffmpeg(path.join(__dirname, '..', config.uploads.folder, file.name))
					.thumbnail({
						timestamps: [0],
						filename: '%b.png',
						folder: path.join(__dirname, '..', config.uploads.folder, 'thumbs'),
						size: '200x?'
					})
					.on('error', error => console.log('Error - ', error.message));
			} else {
				let size = {
					width: 200,
					height: 200
				};
				gm(path.join(__dirname, '..', config.uploads.folder, file.name))
					.resize(size.width, size.height + '>')
					.gravity('Center')
					.extent(size.width, size.height)
					.background('transparent')
					.write(thumbname, error => {
						if (error) console.log('Error - ', error);
					});
			}
		}
	});
};

module.exports = utilsController;
