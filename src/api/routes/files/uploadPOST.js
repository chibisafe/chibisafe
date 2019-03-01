const Route = require('../../structures/Route');
const path = require('path');
const Util = require('../../utils/Util');
const moment = require('moment');
const log = require('../../utils/Log');
const jetpack = require('fs-jetpack');
const Busboy = require('busboy');
const fs = require('fs');
const { dump } = require('dumper.js');
/*
	TODO: Strip exif data if the owner/user configured it as such
	TODO: If source has transparency generate a png thumbnail, otherwise a jpg.
	TODO: If source is a gif, generate a thumb of the first frame and play the gif on hover.
	TODO: If source is a video, generate a thumb of the first frame and save the video length.
	TODO: Check that the async isAuthorized works and is not nulling out
	TODO: Lowercase the file extensions
*/

class uploadPOST extends Route {
	constructor() {
		super('/upload', 'post', { bypassAuth: true });
	}

	async run(req, res, db) {
		const user = await Util.isAuthorized(req);
		// TODO: .env variables are all casted to strings. pepehands
		if (!user && process.env.PUBLIC_MODE == 'false') return res.status(401).json({ message: 'Not authorized to use this resource' });
		return this.uploadFile(req, res, db, user);
	}

	async processFile(req, res, db, user, file) {
		/*
			Check if the user is trying to upload to an album
		*/
		const albumId = req.body.albumid || req.headers.albumid;
		if (albumId && !user) return res.status(401).json({ message: 'Only registered users can upload files to an album' });
		if (albumId && user) {
			const album = await db.table('albums').where({ id: albumId, userId: user.id }).first();
			if (!album) return res.status(401).json({ message: 'Album doesn\'t exist or it doesn\'t belong to the user' });
		}

		/*
		if (!albumId) log.info('Incoming file');
		else log.info(`Incoming file for album ${albumId}`);
		*/

		let upload = file.data;
		/*
			If it's a chunked upload but this is not the last part of the chunk, just green light.
			Otherwise, put the file together and process it
		*/
		if (file.body.uuid) {
			if (file.body.chunkindex < file.body.totalchunkcount - 1) { // eslint-disable-line no-lonely-if
				/*
					We got a chunk that is not the last part, send smoke signal that we received it.
				*/
				return res.json({ message: 'Successfully uploaded chunk' });
			}
			/*
				Seems we finally got the last part of a chunk upload
			*/
			const uploadsDir = path.join(__dirname, '..', '..', '..', '..', process.env.UPLOAD_FOLDER);
			const chunkedFileDir = path.join(__dirname, '..', '..', '..', '..', process.env.UPLOAD_FOLDER, 'chunks', file.body.uuid);
			const chunkFiles = await jetpack.findAsync(chunkedFileDir, { matching: '*' });
			const originalname = Util.getFilenameFromPath(chunkFiles[0].substring(0, chunkFiles[0].lastIndexOf('.')));

			const tempFile = {
				filename: Util.getUniqueFilename(originalname),
				originalname,
				size: file.body.totalfilesize
			};

			for (const chunkFile of chunkFiles) {
				try {
					const data = await jetpack.readAsync(chunkFile, 'buffer'); // eslint-disable-line no-await-in-loop
					await jetpack.appendAsync(path.join(uploadsDir, tempFile.filename), data); // eslint-disable-line no-await-in-loop
				} catch (error) {
					log.error(error);
				}
			}

			try {
				await jetpack.removeAsync(chunkedFileDir);
			} catch (error) {
				log.error(error);
			}

			upload = tempFile;
		}

		/*
			First let's get the hash of the file. This will be useful to check if the file
			has already been upload by either the user or an anonymous user.
			In case this is true, instead of uploading it again we retrieve the url
			of the file that is already saved and thus don't store extra copies of the same file.
		*/
		const hash = await Util.getFileHash(upload.filename); // eslint-disable-line no-await-in-loop
		const exists = await db.table('files') // eslint-disable-line no-await-in-loop
			.where(function() {
				if (!user) this.whereNull('userId'); // eslint-disable-line no-invalid-this
				else this.where('userId', user.id); // eslint-disable-line no-invalid-this
			})
			.where({ hash })
			.first();

		if (exists) {
			res.json({
				message: 'Successfully uploaded file BUT IT EXISTED ALREADY',
				name: exists.name,
				size: exists.size,
				url: `${process.env.DOMAIN}/${exists.name}`,
				deleteUrl: `${process.env.DOMAIN}/api/file/${exists.id}`
			});

			return Util.deleteFile(upload.filename);
		}

		/*
			The file doesn't appear to exist yet for this user, so let's
			store the details on the database.
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
					name: upload.filename,
					original: upload.originalname,
					type: upload.mimetype || '',
					size: upload.size,
					hash,
					ip: req.ip,
					createdAt: now,
					editedAt: now
				});
			} else {
				insertedId = await db.table('files').insert({
					userId: user ? user.id : null,
					name: upload.filename,
					original: upload.originalname,
					type: upload.mimetype || '',
					size: upload.size,
					hash,
					ip: req.ip,
					createdAt: now,
					editedAt: now
				}, 'id');
			}
		} catch (error) {
			log.error('There was an error saving the file to the database');
			log.error(error);
			return res.status(500).json({ message: 'There was an error uploading the file.' });
		}

		res.json({
			message: 'Successfully uploaded file',
			name: upload.filename,
			size: upload.size,
			url: `${process.env.DOMAIN}/${upload.filename}`,
			deleteUrl: `${process.env.DOMAIN}/api/file/${insertedId[0]}`
		});

		/*
			If the upload had an album specified we make sure to create the relation
			and update the according timestamps..
		*/
		if (albumId) {
			try {
				await db.table('albumsFiles').insert({ albumId, fileId: insertedId[0] });
				await db.table('albums').where('id', albumId).update('editedAt', now);
			} catch (error) {
				log.error('There was an error updating editedAt on an album');
				log.error(error);
			}
		}

		/*
			If exif removal has been force service-wide or requested by the user, remove it
		*/
		if (process.env.STRIP_EXIF) { // || user.settings.stripExif) {
			// Util.removeExif(upload.filename);
		}

		/*
			Generate those thumbnails
		*/
		return Util.generateThumbnails(upload.filename);
	}

	uploadFile(req, res, db, user) {
		const busboy = new Busboy({
			headers: req.headers,
			limits: {
				fileSize: process.env.MAX_SIZE * (1000 * 1000),
				files: 1
			}
		});

		const fileToUpload = {
			data: {},
			body: {}
		};

		/*
			Note: For this to work on every case, whoever is uploading a chunk
			should really send the body first and the file last. Otherwise lolisafe
			may not catch the field on time and the chunk may end up being saved
			as a standalone file, completely broken.
		*/
		busboy.on('field', (fieldname, val) => {
			if (/^dz/.test(fieldname)) {
				fileToUpload.body[fieldname.substring(2)] = val;
			} else {
				fileToUpload.body[fieldname] = val;
			}
		});

		/*
			Hey ther's a file! Let's upload it.
		*/
		busboy.on('file', (fieldname, file, filename, encoding, mimetype) => {
			let name;
			let saveTo;

			/*
				Let check whether the file is part of a chunk upload or if it's a standalone one.
				If the former, we should store them separately and join all the pieces after we
				receive the last one.
			*/
			const ext = path.extname(filename).toLowerCase();
			if (Util.isExtensionBlocked(ext)) return res.status(400).json({ message: 'This extension is not allowed.' });

			if (fileToUpload.body.uuid) {
				name = `${filename}.${fileToUpload.body.chunkindex}`;
				const chunkDir = path.join(__dirname, '..', '..', '..', '..', process.env.UPLOAD_FOLDER, 'chunks', fileToUpload.body.uuid);
				jetpack.dir(chunkDir);
				saveTo = path.join(__dirname, '..', '..', '..', '..', process.env.UPLOAD_FOLDER, 'chunks', fileToUpload.body.uuid, name);
			} else {
				name = Util.getUniqueFilename(filename);
				if (!name) return res.status(500).json({ message: 'There was a problem allocating a filename for your upload' });
				saveTo = path.join(__dirname, '..', '..', '..', '..', process.env.UPLOAD_FOLDER, name);
			}

			/*
				Let's save some metadata for the db.
			*/
			fileToUpload.data = { filename: name, originalname: filename, encoding, mimetype };
			const stream = fs.createWriteStream(saveTo);

			file.on('data', data => {
				fileToUpload.data.size = data.length;
			});

			/*
				The file that is being uploaded is bigger than the limit specified on the config file
				and thus we should close the stream and delete the file.
			*/
			file.on('limit', () => {
				file.unpipe(stream);
				stream.end();
				jetpack.removeAsync(saveTo);
				return res.status(400).json({ message: 'The file is too big.' });
			});

			file.on('error', err => {
				log.error('There was an error uploading a file');
				log.error(err);
				return res.status(500).json({ message: 'There was an error uploading the file.' });
			});

			/*
				TODO: Does this even work??
			*/
			return file.pipe(stream);
		});

		busboy.on('error', err => {
			log.error('There was an error uploading a file');
			log.error(err);
			return res.status(500).json({ message: 'There was an error uploading the file.' });
		});

		busboy.on('finish', () => this.processFile(req, res, db, user, fileToUpload));
		req.pipe(busboy);
	}
}

module.exports = uploadPOST;
