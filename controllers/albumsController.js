const config = require('../config.js');
const db = require('knex')(config.database);
const randomstring = require('randomstring');
const utils = require('./utilsController.js');
const path = require('path');
const fs = require('fs');
const Zip = require('jszip');
const albumsController = {};

albumsController.list = async (req, res, next) => {
	const user = await utils.authorize(req, res);

	const fields = ['id', 'name'];
	if (req.params.sidebar === undefined) {
		fields.push('timestamp');
		fields.push('identifier');
	}

	const albums = await db.table('albums').select(fields).where({ enabled: 1, userid: user.id });
	if (req.params.sidebar !== undefined) {
		return res.json({ success: true, albums });
	}

	let ids = [];
	for (let album of albums) {
		album.date = new Date(album.timestamp * 1000);
		album.date = utils.getPrettyDate(album.date);

		album.identifier = `${config.domain}/a/${album.identifier}`;
		ids.push(album.id);
	}

	const files = await db.table('files').whereIn('albumid', ids).select('albumid');
	const albumsCount = {};

	for (let id of ids) albumsCount[id] = 0;
	for (let file of files) albumsCount[file.albumid] += 1;
	for (let album of albums) album.files = albumsCount[album.id];

	return res.json({ success: true, albums });
};

albumsController.create = async (req, res, next) => {
	const user = await utils.authorize(req, res);

	const name = req.body.name;
	if (name === undefined || name === '') {
		return res.json({ success: false, description: 'No album name specified' });
	}

	const album = await db.table('albums').where({
		name: name,
		enabled: 1,
		userid: user.id
	}).first();

	if (album) {
		return res.json({ success: false, description: 'There\'s already an album with that name' });
	}

	await db.table('albums').insert({
		name: name,
		enabled: 1,
		userid: user.id,
		identifier: randomstring.generate(8),
		timestamp: Math.floor(Date.now() / 1000)
	});

	return res.json({ success: true });
};

albumsController.delete = async (req, res, next) => {
	const user = await utils.authorize(req, res);

	const id = req.body.id;
	if (id === undefined || id === '') {
		return res.json({ success: false, description: 'No album specified' });
	}

	await db.table('albums').where({ id: id, userid: user.id }).update({ enabled: 0 });
	return res.json({ success: true });
};

albumsController.rename = async (req, res, next) => {
	const user = await utils.authorize(req, res);

	const id = req.body.id;
	if (id === undefined || id === '') {
		return res.json({ success: false, description: 'No album specified' });
	}

	const name = req.body.name;
	if (name === undefined || name === '') {
		return res.json({ success: false, description: 'No name specified' });
	}

	const album = await db.table('albums').where({ name: name, userid: user.id }).first();
	if (album) {
		return res.json({ success: false, description: 'Name already in use' });
	}

	await db.table('albums').where({ id: id, userid: user.id }).update({ name: name });
	return res.json({ success: true });
};

albumsController.get = async (req, res, next) => {
	const identifier = req.params.identifier;
	if (identifier === undefined) return res.status(401).json({ success: false, description: 'No identifier provided' });

	const album = await db.table('albums').where({ identifier, enabled: 1 }).first();
	if (!album) return res.json({ success: false, description: 'Album not found' });

	const title = album.name;
	const files = await db.table('files').select('name').where('albumid', album.id).orderBy('id', 'DESC');

	for (let file of files) {
		file.file = `${config.domain}/${file.name}`;

		const ext = path.extname(file.name).toLowerCase();
		if (utils.imageExtensions.includes(ext) || utils.videoExtensions.includes(ext)) {
			file.thumb = `${config.domain}/thumbs/${file.name.slice(0, -ext.length)}.png`;
		}
	}

	return res.json({
		success: true,
		title: title,
		count: files.length,
		files
	});
};


albumsController.generateZip = async (req, res, next) => {
	const identifier = req.params.identifier;
	if (identifier === undefined) return res.status(401).json({ success: false, description: 'No identifier provided' });
	if (!config.uploads.generateZips) return res.status(401).json({ success: false, description: 'Zip generation disabled' });

	const album = await db.table('albums').where({ identifier, enabled: 1 }).first();
	if (!album) return res.json({ success: false, description: 'Album not found' });

	if (album.zipGeneratedAt > album.editedAt) {
		const filePath = path.join(config.uploads.folder, 'zips', `${identifier}.zip`);
		const fileName = `${album.name}.zip`;
		return res.download(filePath, fileName);
	} else {
		console.log(`Generating zip for album identifier: ${identifier}`);
		const files = await db.table('files').select('name').where('albumid', album.id);
		if (files.length === 0) return res.json({ success: false, description: 'There are no files in the album' });

		const zipPath = path.join(__dirname, '..', config.uploads.folder, 'zips', `${album.identifier}.zip`);
		let archive = new Zip();

		for (let file of files) {
			try {
				const exists = fs.statSync(path.join(__dirname, '..', config.uploads.folder, file.name));
				archive.file(file.name, fs.readFileSync(path.join(__dirname, '..', config.uploads.folder, file.name)));
			} catch (err) {
				console.log(err);
			}
		}

		archive
			.generateNodeStream({ type: 'nodebuffer', streamFiles: true })
			.pipe(fs.createWriteStream(zipPath))
			.on('finish', async () => {
				console.log(`Generated zip for album identifier: ${identifier}`);
				await db.table('albums')
					.where('id', album.id)
					.update({ zipGeneratedAt: Math.floor(Date.now() / 1000) });

				const filePath = path.join(config.uploads.folder, 'zips', `${identifier}.zip`);
				const fileName = `${album.name}.zip`;
				return res.download(filePath, fileName);
			});
	}
};

module.exports = albumsController;
