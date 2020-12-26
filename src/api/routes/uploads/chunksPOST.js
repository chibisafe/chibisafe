const path = require('path');
const jetpack = require('fs-jetpack');
const randomstring = require('randomstring');
const Util = require('../../utils/Util');
const Route = require('../../structures/Route');

class uploadPOST extends Route {
	constructor() {
		super('/upload/chunks', 'post', {
			bypassAuth: true,
			canApiKey: true
		});
	}

	async run(req, res, db) {
		const user = await Util.isAuthorized(req);
		if (!user && process.env.PUBLIC_MODE === 'false') return res.status(401).json({ message: 'Not authorized to use this resource' });

		const filename = Util.getUniqueFilename(randomstring.generate(32));
		// console.log('Files', req.body.files);
		const info = {
			size: req.body.files[0].size,
			url: `${process.env.DOMAIN}/`
		};

		for (const chunk of req.body.files) {
			const { uuid } = chunk;
			// console.log('Chunk', chunk);

			const chunkOutput = path.join(__dirname,
				'../../../../',
				process.env.UPLOAD_FOLDER,
				'chunks',
				uuid);
			const chunkDir = await jetpack.list(chunkOutput);
			const ext = path.extname(chunkDir[0]);
			const output = path.join(__dirname,
				'../../../../',
				process.env.UPLOAD_FOLDER,
				`${filename}${ext || ''}`);
			chunkDir.sort();

			// Save some data
			info.name = `${filename}${ext || ''}`;
			info.url += `${filename}${ext || ''}`;
			info.data = chunk;

			for (let i = 0; i < chunkDir.length; i++) {
				const dir = path.join(__dirname,
					'../../../../',
					process.env.UPLOAD_FOLDER,
					'chunks',
					uuid,
					chunkDir[i]);
				const file = await jetpack.readAsync(dir, 'buffer');
				await jetpack.appendAsync(output, file);
			}
			await jetpack.removeAsync(chunkOutput);
		}

		/*
			If a file with the same hash and user is found, delete this
			uploaded copy and return a link to the original
		*/
		info.hash = await Util.getFileHash(info.name);
		let existingFile = await Util.checkIfFileExists(db, user, info.hash);
		if (existingFile) {
			existingFile = Util.constructFilePublicLink(existingFile);
			res.json({
				message: 'Successfully uploaded the file.',
				name: existingFile.name,
				hash: existingFile.hash,
				size: existingFile.size,
				url: `${process.env.DOMAIN}/${existingFile.name}`,
				deleteUrl: `${process.env.DOMAIN}/api/file/${existingFile.id}`,
				repeated: true
			});

			return Util.deleteFile(info.name);
		}

		// Otherwise generate thumbs and do the rest
		Util.generateThumbnails(info.name);
		const insertedId = await Util.saveFileToDatabase(req, res, user, db, info, {
			originalname: info.data.original, mimetype: info.data.type
		});
		if (!insertedId) return res.status(500).json({ message: 'There was an error saving the file.' });
		info.deleteUrl = `${process.env.DOMAIN}/api/file/${insertedId[0]}`;
		Util.saveFileToAlbum(db, req.headers.albumid, insertedId);
		delete info.chunk;

		return res.status(201).send({
			message: 'Sucessfully merged the chunk(s).',
			...info
		});
	}
}

module.exports = uploadPOST;
