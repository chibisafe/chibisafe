const path = require('path');
const jetpack = require('fs-jetpack');
const multer = require('multer');

const Util = require('../../utils/Util');
const Route = require('../../structures/Route');
const multerStorage = require('../../utils/multerStorage');

const chunksData = {};
const chunkedUploadsTimeout = 1800000;
const chunksDir = path.join(__dirname, '../../../../uploads/chunks');
const uploadDir = path.join(__dirname, '../../../../uploads');


const cleanUpChunks = async (uuid, onTimeout) => {
	// Remove tmp file
	await jetpack.removeAsync(path.join(chunksData[uuid].root, chunksData[uuid].filename))
		.catch(error => {
			if (error.code !== 'ENOENT') console.error(error);
		});

	// Remove UUID dir
	await jetpack.removeAsync(chunksData[uuid].root);

	// Delete cached chunks data
	if (!onTimeout) chunksData[uuid].clearTimeout();
	delete chunksData[uuid];
};

class ChunksData {
	constructor(uuid, root) {
		this.uuid = uuid;
		this.root = root;
		this.filename = 'tmp';
		this.chunks = 0;
		this.stream = null;
		this.hasher = null;
	}

	onTimeout() {
		if (this.stream && !this.stream.writableEnded) {
			this.stream.end();
		}
		if (this.hasher) {
			this.hasher.dispose();
		}
		cleanUpChunks(this.uuid, true);
	}

	setTimeout(delay) {
		this.clearTimeout();
		this._timeout = setTimeout(this.onTimeout.bind(this), delay);
	}

	clearTimeout() {
		if (this._timeout) {
			clearTimeout(this._timeout);
		}
	}
}

const initChunks = async uuid => {
	if (chunksData[uuid] === undefined) {
		const root = path.join(chunksDir, uuid);
		await jetpack.dirAsync(root);
		chunksData[uuid] = new ChunksData(uuid, root);
	}
	chunksData[uuid].setTimeout(chunkedUploadsTimeout);
	return chunksData[uuid];
};

const executeMulter = multer({
	// Guide: https://github.com/expressjs/multer#limits
	limits: {
		fileSize: Util.config.maxSize * (1000 * 1000),
		// Maximum number of non-file fields.
		// Dropzone.js will add 6 extra fields for chunked uploads.
		// We don't use them for anything else.
		fields: 6,
		// Maximum number of file fields.
		// Chunked uploads still need to provide ONLY 1 file field.
		// Otherwise, only one of the files will end up being properly stored,
		// and that will also be as a chunk.
		files: 1
	},
	fileFilter(req, file, cb) {
		file.extname = Util.getExtension(file.originalname);
		if (Util.isExtensionBlocked(file.extname)) {
			return cb(`${file.extname ? `${file.extname.substr(1).toUpperCase()} files` : 'Files with no extension'} are not permitted.`);
		}

		// Re-map Dropzone keys so people can manually use the API without prepending 'dz'
		for (const key in req.body) {
			if (!/^dz/.test(key)) continue;
			req.body[key.replace(/^dz/, '')] = req.body[key];
			delete req.body[key];
		}

		return cb(null, true);
	},
	storage: multerStorage({
		destination(req, file, cb) {
			// Is file a chunk!?
			file._isChunk = req.body.uuid !== undefined && req.body.chunkindex !== undefined;

			if (file._isChunk) {
				initChunks(req.body.uuid)
					.then(chunksData => {
						file._chunksData = chunksData;
						cb(null, chunksData.root);
					})
					.catch(error => {
						console.error(error);
						return cb('Could not process the chunked upload. Try again?');
					});
			} else {
				return cb(null, uploadDir);
			}
		},

		filename(req, file, cb) {
			if (file._isChunk) {
				return cb(null, chunksData[req.body.uuid].filename);
			}
			const name = Util.getUniqueFilename(file.extname);
			if (name) return cb(null, name);
			return cb('ERROR');
		}
	})
}).array('files[]');

const uploadFile = async (req, res) => {
	const error = await new Promise(resolve => executeMulter(req, res, err => resolve(err)));

	if (error) {
		const suppress = [
			'LIMIT_FILE_SIZE',
			'LIMIT_UNEXPECTED_FILE'
		];
		if (suppress.includes(error.code)) {
			throw error.toString();
		} else {
			throw error;
		}
	}

	if (!req.files || !req.files.length) {
		throw 'No files.'; // eslint-disable-line no-throw-literal
	}

	// If the uploaded file is a chunk then just say that it was a success
	const uuid = req.body.uuid;
	if (chunksData[uuid] !== undefined) {
		req.files.forEach(() => {
			chunksData[uuid].chunks++;
		});
		res.json({ success: true });
		return;
	}

	const infoMap = req.files.map(file => ({
		path: path.join(uploadDir, file.filename),
		data: { ...file, mimetype: Util.getMimeFromType(file.fileType) || file.mimetype || '' }
	}));

	return infoMap[0];
};

const finishChunks = async req => {
	const check = file => typeof file.uuid !== 'string' ||
    !chunksData[file.uuid] ||
    chunksData[file.uuid].chunks < 2;

	const files = req.body.files;
	if (!Array.isArray(files) || !files.length || files.some(check)) {
		throw 'An unexpected error occurred.'; // eslint-disable-line no-throw-literal
	}

	const infoMap = [];
	try {
		await Promise.all(files.map(async file => {
			// Close stream
			chunksData[file.uuid].stream.end();

			/*
			if (chunksData[file.uuid].chunks > maxChunksCount) {
				throw 'Too many chunks.'; // eslint-disable-line no-throw-literal
			}
			*/

			file.extname = typeof file.original === 'string' ? Util.getExtension(file.original) : '';
			file.fileType = chunksData[file.uuid].fileType;
			file.mimetype = Util.getMimeFromType(chunksData[file.uuid].fileType) || file.mimetype || '';

			if (Util.isExtensionBlocked(file.extname)) {
				throw `${file.extname ? `${file.extname.substr(1).toUpperCase()} files` : 'Files with no extension'} are not permitted.`; // eslint-disable-line no-throw-literal
			}

			file.size = chunksData[file.uuid].stream.bytesWritten;

			// Double-check file size
			const tmpfile = path.join(chunksData[file.uuid].root, chunksData[file.uuid].filename);
			const lstat = await jetpack.inspect(tmpfile);
			if (lstat.size !== file.size) {
				throw `File size mismatched (${lstat.size} vs. ${file.size}).`; // eslint-disable-line no-throw-literal
			}

			// Generate name
			const name = Util.getUniqueFilename(file.extname);

			// Move tmp file to final destination
			const destination = path.join(uploadDir, name);
			await jetpack.move(tmpfile, destination);
			const hash = chunksData[file.uuid].hasher.digest('hex');

			// Continue even when encountering errors
			await cleanUpChunks(file.uuid).catch(console.error);

			const data = {
				filename: name,
				originalname: file.original || '',
				extname: file.extname,
				mimetype: file.mimetype,
				size: file.size,
				hash
			};

			infoMap.push({ path: destination, data });
		}));

		return infoMap[0];
	} catch (error) {
		// Dispose unfinished hasher and clean up leftover chunks
		// Should continue even when encountering errors
		files.forEach(file => {
			if (chunksData[file.uuid] === undefined) return;
			try {
				if (chunksData[file.uuid].hasher) {
					chunksData[file.uuid].hasher.dispose();
				}
			} catch (_) {}
			cleanUpChunks(file.uuid).catch(console.error);
		});

		// Re-throw error
		throw error;
	}
};

class uploadPOST extends Route {
	constructor() {
		super('/upload', 'post', {
			bypassAuth: true,
			canApiKey: true
		});
	}

	async run(req, res, db) {
		const user = await Util.isAuthorized(req);
		if (!user && !Util.config.publicMode) return res.status(401).json({ message: 'Not authorized to use this resource' });
		const { finishedchunks } = req.headers;
		const albumId = req.headers.albumid ? req.headers.albumid === 'null' ? null : req.headers.albumid : null;
		if (albumId && !user) return res.status(401).json({ message: 'Only registered users can upload files to an album' });
		if (albumId && user) {
			const album = await db.table('albums').where({ id: albumId, userId: user.id }).first();
			if (!album) return res.status(401).json({ message: 'Album doesn\'t exist or it doesn\'t belong to the user' });
		}


		let file;
		if (finishedchunks) {
			file = await finishChunks(req, res);
		} else {
			// If nothing is returned we assume it was a chunk ¯\_(ツ)_/¯
			file = await uploadFile(req, res);
			if (!file) return;
		}

		// If nothing is returned means the file was duplicated and we already sent the response
		const result = await Util.storeFileToDb(req, res, user, file, db);
		if (!result) return;

		if (albumId) await Util.saveFileToAlbum(db, albumId, result.id);

		result.file = Util.constructFilePublicLink(req, result.file);
		result.deleteUrl = `${Util.getHost(req)}/api/file/${result.id[0]}`;

		return res.status(201).send({
			message: 'Sucessfully uploaded the file.',
			url: result.file.url,
			name: result.file.name,
			hash: result.file.hash,
			deleteUrl: result.deleteUrl,
			size: result.file.size,
			thumb: result.file.thumb
		});
	}
}

module.exports = uploadPOST;
