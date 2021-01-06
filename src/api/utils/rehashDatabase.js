require('dotenv').config();
const blake3 = require('blake3');
const path = require('path');
const fs = require('fs');
const db = require('knex')({
	client: 'sqlite3',
	connection: {
		filename: path.join(__dirname, '../../../database/', 'database.sqlite')
	}
});

const start = async () => {
	const hrstart = process.hrtime();
	const uploads = await db.table('files')
		.select('id', 'name', 'hash');
	console.log(`Uploads : ${uploads.length}`);


	let done = 0;
	const printProgress = () => {
		console.log(`PROGRESS: ${done}/${uploads.length}`);
		if (done >= uploads.length) clearInterval(progressInterval);
	};
	const progressInterval = setInterval(printProgress, 1000);
	printProgress();

	for (const upload of uploads) {
		await new Promise((resolve, reject) => {
			fs.createReadStream(path.join(__dirname, '../../../uploads', upload.name))
				.on('error', reject)
				.pipe(blake3.createHash())
				.on('error', reject)
				.on('data', async source => {
					const hash = source.toString('hex');
					console.log(`${upload.name}: ${hash}`);
					await db.table('files')
						.update('hash', hash)
						.where('id', upload.id);
					done++;
					resolve();
				});
		}).catch(error => {
			console.log(`${upload.name}: ${error.toString()}`);
		});
	}

	clearInterval(progressInterval);
	printProgress();

	const hrend = process.hrtime(hrstart);
	console.log(`Done in : ${(hrend[0] + (hrend[1] / 1e9)).toFixed(4)}s`);
};

start();
