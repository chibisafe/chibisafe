import type { FastifyInstance } from 'fastify';
import { Server, EVENTS } from '@tus/server';
import { FileStore } from '@tus/file-store';
import {
	getUniqueFileIdentifier,
	isExtensionBlocked,
	storeFileToDb,
	constructFilePublicLink,
	hashFile,
	deleteFile
} from '../utils/File';
import { generateThumbnails } from '../utils/Thumbnails';
import { authUser, validateAlbum } from '../utils/UploadHelpers';
import { SETTINGS } from './settings';
import jetpack from 'fs-jetpack';
import proxyaddr from 'proxy-addr';

import path from 'node:path';
import log from '../utils/Log';

const tusServer = new Server({
	path: '/api/tus',
	datastore: new FileStore({ directory: path.join(__dirname, '..', '..', '..', 'uploads') })
});

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
	log.debug('> onUploadCreate');
	if (!upload.metadata) throw new Error('No metadata for file.');
	if (!upload.metadata.filename) throw new Error('No filename in metadata.');
	if (!upload.size) throw new Error('No size for file.');

	// Validate files
	const fileExtension = path.extname(upload.metadata.filename);
	if (isExtensionBlocked(fileExtension)) {
		throw new Error(
			fileExtension
				? `${fileExtension.toUpperCase()} files are not permitted.`
				: 'Files with no extension are not permitted.'
		);
	}

	if (upload.size === 0) {
		throw new Error('Zero-bytes file is not allowed.');
	}

	log.debug(`> Upload size: ${upload.size / 1000 / 1000} / ${SETTINGS.maxSize} MB`);

	if (upload.size / 1000 / 1000 > SETTINGS.maxSize) {
		throw new Error('File is too large.');
	}

	// Validate user and album if any
	// TODO: Validate if public uploads are allowed
	const user = await authUser(req.headers.authorization);
	const album = await validateAlbum(req.headers.albumuuid as string, user);

	// Store user and album in upload object so that
	// onUploadFinish has access to them

	// @ts-ignore
	// eslint-disable-next-line require-atomic-updates
	upload.metadata.internal = {
		user,
		album,
		ip: proxyaddr(req, () => true),
		identifier: null,
		repeated: false
	};

	return res;
};

tusServer.options.onUploadFinish = async (req, res, upload) => {
	log.debug('> onUploadFinish');

	// Assign a unique identifier to the file
	const uniqueIdentifier = await getUniqueFileIdentifier();
	if (!uniqueIdentifier) throw new Error('Could not generate unique identifier.');

	// @ts-ignore
	const newFileName = uniqueIdentifier + path.extname(upload.metadata.filename);
	// @ts-ignore
	upload.metadata.internal.identifier = newFileName;

	log.debug(`> Name for upload: ${newFileName}`);

	const file = {
		name: newFileName,
		// @ts-ignore
		extension: path.extname(upload.metadata.filename),
		path: upload.id,
		// @ts-ignore
		original: upload.metadata.filename as string,
		// @ts-ignore
		type: upload.metadata.type as string,
		// @ts-ignore
		size: upload.size / 1000 / 1000,
		hash: await hashFile(upload.id),
		// @ts-ignore
		ip: upload.metadata.internal.ip
	};

	// @ts-ignore
	const user = upload.metadata.internal.user;
	// @ts-ignore
	const album = upload.metadata.internal.album;

	const savedFiled = await storeFileToDb(user ? user : undefined, file, album ? album : undefined);
	if (savedFiled.repeated) {
		// @ts-ignore
		// eslint-disable-next-line require-atomic-updates
		upload.metadata.internal.repeated = true;
	}

	const publicLink = `${req.headers.protocol}://${req.headers.host}/${newFileName}`;
	res.setHeader('public-link', publicLink);

	return res;
};

tusServer.on(EVENTS.POST_FINISH, async (req, res, upload) => {
	log.debug('> EVENTS.POST_FINISH');
	// @ts-ignore
	if (!upload.metadata.internal.identifier) throw new Error('No identifier for file.');

	// @ts-ignore
	if (upload.metadata.internal.repeated) {
		await deleteFile(upload.id);
		return;
	}

	await jetpack.moveAsync(
		path.join(__dirname, '..', '..', '..', 'uploads', upload.id),
		// @ts-ignore
		path.join(__dirname, '..', '..', '..', 'uploads', upload.metadata.internal.identifier)
	);

	// @ts-ignore
	void generateThumbnails(upload.metadata.internal.identifier);
});

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
			req.raw.headers.protocol = req.protocol;
			await tusServer.handle(req.raw, res.raw);
		});
		server.all('/api/tus/*', async (req, res) => {
			req.raw.headers.protocol = req.protocol;
			await tusServer.handle(req.raw, res.raw);
		});
	}
};
