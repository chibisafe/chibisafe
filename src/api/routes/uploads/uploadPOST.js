const Route = require('../../structures/Route');
const path = require('path');
const Util = require('../../utils/Util');
const jetpack = require('fs-jetpack');
const multer = require('multer');
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

			const remappedKeys = this._remapKeys(req.body);
			// const { uuid, chunkindex } = this._remapKeys(req.body);
			let uploadedFile = {};
			for (const file of req.files) {
				// console.log(file);
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

			if (!remappedKeys || !remappedKeys.uuid) Util.generateThumbnails(uploadedFile.name);

			return res.send(201, {
				message: 'Sucessfully uploaded the file.',
				...uploadedFile
			});
		});
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
