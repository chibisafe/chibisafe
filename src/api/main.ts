import HyperExpress from 'hyper-express';
import jetpack from 'fs-jetpack';
import log from './utils/Log';
// import helmet from 'helmet';
import cors from 'cors';
import Routes from './structures/routes';

// Stray errors and exceptions capturers
process.on('uncaughtException', error => {
	log.error('Uncaught Exception:', error);
});

process.on('unhandledRejection', error => {
	log.error('Unhandled Rejection:', error);
});

const start = async () => {
	const server = new HyperExpress.Server({
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
	jetpack.dir('uploads/chunks');
	jetpack.dir('uploads/thumbs/square');
	jetpack.dir('uploads/thumbs/preview');

	// Scan and load routes into express
	await Routes.load(server);

	// Start the server
	await server.listen(8000);
	log.info('Server started on port 8000');
};

void start();
