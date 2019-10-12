const Route = require('../../structures/Route');
const path = require('path');
const Util = require('../../utils/Util');
const jetpack = require('fs-jetpack');
const multer = require('multer');
const moment = require('moment');
const upload = multer({
	storage: multer.memoryStorage(),
	limits: {
		fileSize: parseInt(process.env.MAX_SIZE, 10) * (1000 * 1000),
		files: 1
	},
	fileFilter: (req, file, cb) => {
		/*
		if (options.blacklist.mimes.includes(file.mimetype)) {
			return cb(new Error(`${file.mimetype} is a blacklisted filetype.`));
		} else if (options.blacklist.extensions.some(ext => path.extname(file.originalname).toLowerCase() === ext)) {
			return cb(new Error(`${path.extname(file.originalname).toLowerCase()} is a blacklisted extension.`));
		}
		*/
		return cb(null, true);
	}
}).array('files[]');

class uploadPOST extends Route {
	constructor() {
		super('/upload', 'post', { bypassAuth: true });
	}

	async run(req, res, db) {
		const user = await Util.isAuthorized(req);
		if (!user && process.env.PUBLIC_MODE == 'false') return res.status(401).json({ message: 'Not authorized to use this resource' });

		return upload(req, res, async err => {
			if (err) console.error(err.message);

			const albumId = req.body.albumid || req.headers.albumid;
			if (albumId && !user) return res.status(401).json({ message: 'Only registered users can upload files to an album' });
			if (albumId && user) {
				const album = await db.table('albums').where({ id: albumId, userId: user.id }).first();
				if (!album) return res.status(401).json({ message: 'Album doesn\'t exist or it doesn\'t belong to the user' });
			}

			let uploadedFile = {};
			let originalFile;
			let insertedId;

			const remappedKeys = this._remapKeys(req.body);
			for (const file of req.files) {
				originalFile = file;
				const ext = path.extname(file.originalname);
				const hash = Util.generateFileHash(file.buffer);
				const filename = Util.getUniqueFilename(file.originalname);
				if (remappedKeys && remappedKeys.uuid) {
					const chunkOutput = path.join(__dirname,
						'..',
						'..',
						'..',
						'..',
						process.env.UPLOAD_FOLDER,
						'chunks',
						remappedKeys.uuid,
						`${remappedKeys.chunkindex.padStart(3, 0)}${ext || ''}`);
					await jetpack.writeAsync(chunkOutput, file.buffer);
				} else {
					const output = path.join(__dirname,
						'..',
						'..',
						'..',
						'..',
						process.env.UPLOAD_FOLDER,
						filename);
					await jetpack.writeAsync(output, file.buffer);
					uploadedFile = {
						name: filename,
						hash,
						size: file.buffer.length,
						url: filename
					};
				}
			}

			if (!remappedKeys || !remappedKeys.uuid) {
				Util.generateThumbnails(uploadedFile.name);
				insertedId = await this.saveFileToDatabase(req, res, user, db, uploadedFile, originalFile);
				if (!insertedId) return res.status(500).json({ message: 'There was an error saving the file.' });
				uploadedFile.deleteUrl = `${process.env.DOMAIN}/api/file/${insertedId[0]}`;
			}

			return res.status(201).send({
				message: 'Sucessfully uploaded the file.',
				...uploadedFile
			});
		});
	}

	async saveFileToDatabase(req, res, user, db, file, originalFile) {
		/*
			Save the upload information to the database
		*/
		const now = moment.utc().toDate();
		let insertedId = null;
		try {
			/*
				This is so fucking dumb
			*/
			if (process.env.DB_CLIENT === 'sqlite3') {
				insertedId = await db.table('files').insert({
					userId: user ? user.id : null,
					name: file.name,
					original: originalFile.originalname,
					type: originalFile.mimetype || '',
					size: file.size,
					hash: file.hash,
					ip: req.ip,
					createdAt: now,
					editedAt: now
				});
			} else {
				insertedId = await db.table('files').insert({
					userId: user ? user.id : null,
					name: file.name,
					original: originalFile.originalname,
					type: originalFile.mimetype || '',
					size: file.size,
					hash: file.hash,
					ip: req.ip,
					createdAt: now,
					editedAt: now
				}, 'id');
			}
			return insertedId;
		} catch (error) {
			console.error('There was an error saving the file to the database');
			console.error(error);
			return null;
			// return res.status(500).json({ message: 'There was an error uploading the file.' });
		}
	}

	_remapKeys(body) {
		const keys = Object.keys(body);
		if (keys.length) {
			for (const key of keys) {
				if (!/^dz/.test(key)) continue;
				body[key.replace(/^dz/, '')] = body[key];
				delete body[key];
			}
			return body;
		}
	}
}

module.exports = uploadPOST;
