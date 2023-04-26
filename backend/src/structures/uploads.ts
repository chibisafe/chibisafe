import type { FastifyInstance } from 'fastify';
import type { Upload } from '@tus/server';
import type { RequestUser } from './interfaces';
import { Server } from '@tus/server';
import { FileStore } from '@tus/file-store';
import { getUniqueFileIdentifier, isExtensionBlocked, storeFileToDb } from '../utils/File';
import { authUser, validateAlbum } from '../utils/UploadHelpers';
import { SETTINGS } from './settings';

import path from 'node:path';
import log from '../utils/Log';

const tusServer = new Server({
	path: '/api/tus',
	datastore: new FileStore({ directory: path.join(__dirname, '..', '..', 'uploads') })
});

interface UploadObject extends Upload {
	id: string;
	size: number;
	offset: number;
	metadata: {
		authorization?: string;
		albumUuid?: string;
		relativePath: string;
		name: string;
		type: string;
		filetype: string;
		filename: string;
	};
	internal: {
		user?: RequestUser;
		album?: number;
	};
	creation_date: string;
}

/*
	TUS Upload object
	
	Upload {
		id: '5ce0c2d38cbde6837e74445da8665138',
		size: 8373874,
		offset: 0,
		metadata: {
			authorization: 'eyJhbGciOiJIU...'
			albumUuid: 'a1b2c3d4-e5f6-g7h8-i9j0-k1l2m3n4o5p6'
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
	if (!upload.metadata) throw new Error('Zero-bytes file is not allowed.');
	const uploadObject = upload as unknown as UploadObject;

	// Validate files
	const fileExtension = path.extname(uploadObject.metadata.filename);
	if (isExtensionBlocked(fileExtension)) {
		throw new Error(
			fileExtension
				? `${fileExtension.toUpperCase()} files are not permitted.`
				: 'Files with no extension are not permitted.'
		);
	}

	if (uploadObject.size === 0) {
		throw new Error('Zero-bytes file is not allowed.');
	}

	if (uploadObject.size > SETTINGS.maxSize) {
		throw new Error('File is too large.');
	}

	// Validate user and album if any
	// TODO: Validate if public uploads are allowed
	const user = await authUser(uploadObject.metadata.authorization);
	const album = await validateAlbum(uploadObject.metadata.albumUuid, user);

	// @ts-ignore
	// eslint-disable-next-line require-atomic-updates
	upload.internal.user = user;
	// @ts-ignore
	// eslint-disable-next-line require-atomic-updates
	upload.internal.album = album;

	return res;
};

tusServer.options.onUploadFinish = async (req, res, upload) => {
	const uploadObject = upload as unknown as UploadObject;
	log.debug(uploadObject.internal);

	const user = uploadObject.internal.user;
	const album = uploadObject.internal.album;

	// const file = {
	// 	name: 'UNIQUE IDENTIFIER',
	// 	extension: path.extname(uploadObject.metadata.filename),
	// 	path: uploadObject.id,
	// 	original: uploadObject.metadata.filename,
	// 	type: uploadObject.metadata.type,
	// 	size: uploadObject.size,
	// 	hash: 'WE NEED TO HASH THE FILE',
	// 	ip: 'WE NEED TO GET THE IP FROM THE REQUEST'
	// };

	// await storeFileToDb(user ? user : undefined, file, album ? album : undefined);

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

		server.all('/api/tus', async (req, res) => {
			await tusServer.handle(req.raw, res.raw);
		});
		server.all('/api/tus/*', async (req, res) => {
			await tusServer.handle(req.raw, res.raw);
		});
	}
};
