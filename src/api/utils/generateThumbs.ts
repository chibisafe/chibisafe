import dotenv from 'dotenv';
dotenv.config();

import fs from 'fs';
import path from 'path';
import { generateThumbnails } from './ThumbUtil';

const start = async () => {
	const files = fs.readdirSync(path.join(__dirname, '../../../uploads'));
	for (const fileName of files) {
		console.log(`Generating thumb for '${fileName}`);
		// eslint-disable-next-line no-await-in-loop
		await generateThumbnails(fileName);
	}
};

void start();
