const config = require('../config.js');
const routes = require('express').Router();
const db = require('knex')(config.database);
const path = require('path');
const utils = require('../controllers/utilsController.js');

routes.get('/a/:identifier', async (req, res, next) => {
	let identifier = req.params.identifier;
	if (identifier === undefined) return res.status(401).json({ success: false, description: 'No identifier provided' });

	const album = await db.table('albums').where({ identifier, enabled: 1 }).first();
	if (!album) return res.status(404).sendFile('404.html', { root: './pages/error/' });

	const files = await db.table('files').select('name').where('albumid', album.id).orderBy('id', 'DESC');
	let thumb = '';
	const basedomain = config.domain;

	for (let file of files) {
		file.file = `${basedomain}/${file.name}`;

		let ext = path.extname(file.name).toLowerCase();
		if (utils.imageExtensions.includes(ext) || utils.videoExtensions.includes(ext)) {
			file.thumb = `${basedomain}/thumbs/${file.name.slice(0, -ext.length)}.png`;

			/*
				If thumbnail for album is still not set, do it.
				A potential improvement would be to let the user upload a specific image as an album cover
				since embedding the first image could potentially result in nsfw content when pasting links.
			*/

			if (thumb === '') {
				thumb = file.thumb;
			}

			file.thumb = `<img src="${file.thumb}"/>`;
		} else {
			file.thumb = `<h1 class="title">.${ext}</h1>`;
		}
	}


	let enableDownload = false;
	if (config.uploads.generateZips) enableDownload = true;

	return res.render('album', {
		layout: false,
		title: album.name,
		count: files.length,
		thumb,
		files,
		identifier,
		enableDownload
	});
});

module.exports = routes;
