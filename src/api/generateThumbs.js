require('dotenv').config();

const fs = require('fs');
const path = require('path');

const ThumbUtil = require('./utils/ThumbUtil');

const start = async () => {
	const files = fs.readdirSync(path.join(__dirname, '..', '..', process.env.UPLOAD_FOLDER));
	for (const fileName of files) {
		console.log(`Generating thumb for '${fileName}`);
		// eslint-disable-next-line no-await-in-loop
		await ThumbUtil.generateThumbnails(fileName);
	}
};

start();
