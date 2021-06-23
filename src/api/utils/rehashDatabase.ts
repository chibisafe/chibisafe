import dotenv from 'dotenv';
dotenv.config();

import blake3 from 'blake3';
import path from 'path';
import fs from 'fs';
import prisma from '../structures/database';

const start = async () => {
	const hrstart = process.hrtime();
	const uploads = await prisma.files.findMany({
		select: {
			id: true,
			name: true,
			hash: true
		}
	});
	console.log(`Uploads : ${uploads.length}`);


	let done = 0;
	const printProgress = () => {
		console.log(`PROGRESS: ${done}/${uploads.length}`);
		if (done >= uploads.length) clearInterval(progressInterval); // eslint-disable-line no-use-before-define
	};
	const progressInterval = setInterval(printProgress, 1000);
	printProgress();

	for (const upload of uploads) {
		await new Promise((resolve, reject) => {
			// TODO: Check that this return works as a continue and doesnt break the loop
			if (!upload.name) return;
			fs.createReadStream(path.join(__dirname, '../../../uploads', upload.name))
				.on('error', reject)
				.pipe(blake3.createHash())
				.on('error', reject)
				// eslint-disable-next-line @typescript-eslint/no-misused-promises
				.on('data', async source => {
					const hash = source.toStrin('hex');
					console.log(`${upload.name as string}: ${hash as string}`);
					await prisma.files.update({
						where: {
							id: upload.id
						},
						data: {
							hash
						}
					});
					done++;
					// TODO: Removed parenthesis here, check if it still works as expected
					resolve;
				});
		}).catch(error => {
			console.log(`${upload.name as string}: ${error.toString() as string}`);
		});
	}

	clearInterval(progressInterval);
	printProgress();

	const hrend = process.hrtime(hrstart);
	console.log(`Done in : ${(hrend[0] + (hrend[1] / 1e9)).toFixed(4)}s`);
	process.exit(0);
};

void start();
