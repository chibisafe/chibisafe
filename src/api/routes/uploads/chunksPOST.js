const Route = require('../../structures/Route');
const path = require('path');
const Util = require('../../utils/Util');
const jetpack = require('fs-jetpack');
const randomstring = require('randomstring');

class uploadPOST extends Route {
	constructor() {
		super('/upload/chunks', 'post', {
			bypassAuth: true,
			canApiKey: true
		});
	}

	async run(req, res, db) {
		const filename = Util.getUniqueFilename(randomstring.generate(32));
		// console.log('Files', req.body.files);
		const info = {
			size: req.body.files[0].size,
			url: `${process.env.DOMAIN}/`
		};

		for (const chunk of req.body.files) {
			const { uuid, count } = chunk;
			// console.log('Chunk', chunk);

			const chunkOutput = path.join(__dirname,
				'..',
				'..',
				'..',
				'..',
				process.env.UPLOAD_FOLDER,
				'chunks',
				uuid);
			const chunkDir = await jetpack.list(chunkOutput);
			const ext = path.extname(chunkDir[0]);
			const output = path.join(__dirname,
				'..',
				'..',
				'..',
				'..',
				process.env.UPLOAD_FOLDER,
				`${filename}${ext || ''}`);
			chunkDir.sort();

			// Save some data
			info.name = `${filename}${ext || ''}`;
			info.url += `${filename}${ext || ''}`;

			for (let i = 0; i < chunkDir.length; i++) {
				const dir = path.join(__dirname,
					'..',
					'..',
					'..',
					'..',
					process.env.UPLOAD_FOLDER,
					'chunks',
					uuid,
					chunkDir[i]);
				const file = await jetpack.readAsync(dir, 'buffer');
				await jetpack.appendAsync(output, file);
			}
			await jetpack.removeAsync(chunkOutput);
		}

		return res.status(201).send({
			message: 'Sucessfully merged the chunk(s).',
			...info
			/*
			name: `${filename}${ext || ''}`,
			size: exists.size,
			url: `${process.env.DOMAIN}/${exists.name}`,
			deleteUrl: `${process.env.DOMAIN}/api/file/${exists.id}`
			*/
		});
	}
}

module.exports = uploadPOST;
