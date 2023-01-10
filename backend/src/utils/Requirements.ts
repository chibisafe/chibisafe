import process from 'node:process';
import { lookpath } from 'lookpath';
import log from './Log';

export default async () => {
	const nodeMajorVersion = process.versions.node.split('.')[0];
	if (Number(nodeMajorVersion) < 18) {
		log.error('chibisafe needs node v18 or newer to run properly, please upgrade.');
		process.exit(1);
	}

	log.info('Node version: OK');

	if (!process.env.PORT) {
		log.error(
			'It seems there are no environment variables configured. To fix this please rename `.env.sample` to `.env` and fill in the required values.'
		);
		process.exit(1);
	}

	log.info('Env variables: OK');

	const ffmpegExists = await lookpath('ffmpeg');
	if (!ffmpegExists) {
		log.error(
			"chibisafe couldn't find ffmpeg in your path. ffmpeg is needed to process thumbnails for uploads, please install it."
		);
		process.exit(1);
	}

	log.info('ffmpeg: OK');
};
