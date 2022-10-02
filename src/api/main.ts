import HyperExpress from 'hyper-express';
import jetpack from 'fs-jetpack';
import log from './utils/Log';
// import helmet from 'helmet';
import cors from 'cors';
import Routes from './structures/routes';
import { getEnvironmentDefaults } from './utils/Util';

// Stray errors and exceptions capturers
process.on('uncaughtException', error => {
	log.error('Uncaught Exception:');
	log.error(error);
});

process.on('unhandledRejection', error => {
	log.error('Unhandled Rejection:');
	log.error(error);
});

const start = async () => {
	const server = new HyperExpress.Server({
		// TODO: Configurable? Should not trust proxy if directly running on an exposed port,
		// instead of behind a reverse proxy like Nginx, and/or CDNs like Cloudflare
		trust_proxy: true,
		fast_buffers: true
	});

	// TODO: Figure this out
	// server.use(helmet());
	server.use(
		cors({
			allowedHeaders: [
				'Accept',
				'Authorization',
				'Cache-Control',
				'X-Requested-With',
				'Content-Type',
				'albumId',
				'finishedChunks',
				'application/vnd.chibisafe.json' // I'm deprecating this header but will remain here for compatibility reasons
			]
		})
	);

	// Create the neccessary folders
	jetpack.dir('uploads/chunks', { empty: true });
	jetpack.dir('uploads/thumbs/square');
	jetpack.dir('uploads/thumbs/preview');

	// Scan and load routes into express
	await Routes.load(server);

	// TODO: Uploader page
	server.get('/uploader.html', (req, res) => {
		const readStream = jetpack.createReadStream('src/site/uploader.html');
		return res.stream(readStream);
	});

	log.info('');
	log.info('');
	log.info('Chibisafe is starting with the following configuration:');
	log.info('');

	const defaults = getEnvironmentDefaults();
	for (const [key, value] of Object.entries(defaults)) {
		log.info(`${key}: ${JSON.stringify(value)}`);
	}
	log.info('');

	// Start the server
	await server.listen(8000);
	log.info('Server started on port 8000');
};

void start();
