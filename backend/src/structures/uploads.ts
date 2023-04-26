import type { FastifyInstance } from 'fastify';
import { Server } from '@tus/server';
import { FileStore } from '@tus/file-store';
import path from 'node:path';
import log from '../utils/Log';
import { getUniqueFileIdentifier } from '../utils/File';

const tusServer = new Server({
	path: '/api/upload',
	datastore: new FileStore({ directory: path.join(__dirname, '..', '..', 'uploads') })
});

/*
	TUS Upload object
	
	Upload {
		id: '5ce0c2d38cbde6837e74445da8665138',
		size: 8373874,
		offset: 0,
		metadata: {
			relativePath: 'null',
			name: '99015349_p0.jpg',
			type: 'image/jpeg',
			filetype: 'image/jpeg',
			filename: '99015349_p0.jpg'
		},
		creation_date: '2023-04-26T01:32:11.525Z'
	}
*/

tusServer.options.onUploadCreate = async (req, res, upload) => {
	log.debug('Created upload: ', upload);
	console.log('Created upload: ', upload);
	log.debug('Created upload: ', upload);
	return res;
};

tusServer.options.onUploadFinish = async (req, res, upload) => {
	log.debug('Finished upload: ', upload);
	console.log('Finished upload: ', upload);
	log.debug('Finished upload: ', upload);
	return res;
};

export default {
	init: async (server: FastifyInstance) => {
		/**
		 * add new content-type to fastify forewards request
		 * without any parser to leave body untouched
		 *
		 * @see https://www.fastify.io/docs/latest/Reference/ContentTypeParser/
		 */

		server.addContentTypeParser('application/offset+octet-stream', (request, payload, done) => done(null));

		/**
		 * let tus handle preparation and filehandling requests
		 * fastify exposes raw nodejs http req/res via .raw property
		 *
		 * @see https://www.fastify.io/docs/latest/Reference/Request/
		 * @see https://www.fastify.io/docs/latest/Reference/Reply/#raw
		 */
		server.all('/api/upload', async (req, res) => {
			await tusServer.handle(req.raw, res.raw);
		});
		server.all('/api/upload/*', async (req, res) => {
			await tusServer.handle(req.raw, res.raw);
		});
	}
};
