// NOTE: Should this file be named as such?

import type { MultipartField, Response } from 'hyper-express';

import * as blake3 from 'blake3';
import jetpack from 'fs-jetpack';
import path from 'path';
import { inspect } from 'util';

import {
	constructFilePublicLink,
	deleteFile,
	getExtension,
	getUniqueFileIdentifier,
	storeFileToDb,
	unholdFileIdentifiers,
	uploadPath
} from '../../utils/File';
import log from '../../utils/Log';
import { getEnvironmentDefaults, getHost } from '../../utils/Util';

import type { WriteStream } from 'fs';
import type { NodeHash, NodeHashReader } from 'blake3';
import type { FileBasic, RequestWithOptionalUser, RouteOptions } from '../../structures/interfaces';

interface UploadResult {
	message: string;
	name?: string;
	hash?: string;
	size?: number;
	url?: string;
	thumb?: string;
	deleteUrl?: string;
	repeated?: boolean;
}

export const options: RouteOptions = {
	url: '/upload',
	method: 'post',
	middlewares: [
		{
			name: 'auth',
			optional: true
		}
	],
	options: {
		// TODO Util.getConfig()
		max_body_length: getEnvironmentDefaults().maxSize * 1e6 // in bytes
	},
	debug: true
};

export const run = async (req: RequestWithOptionalUser, res: Response) => {
	// TODO: Perhaps have Request Content-Type be configurable via route options,
	// then have it be enforced via a middleware?
	if (!req.is('multipart/form-data')) {
		return res.status(400).json({ message: 'Content-Type must be multipart/form-data.' });
	}

	// Init empty Request.body and Request.files
	const body: { [index: string]: any } = {};
	const files: FileBasic[] = [];

	const cleanUpFiles = async () => {
		unholdFileIdentifiers(res);
		return Promise.all(
			files.map(async file => {
				if (!file.name) return;
				return deleteFile(file.name);
			})
		);
	};

	// TODO: Chunked uploads.
	const multipart = await req
		.multipart(
			{
				// https://github.com/mscdex/busboy/tree/v1.6.0#exports
				// This would otherwise defaults to latin1
				defParamCharset: 'utf8',
				limits: {
					// TODO Util.getConfig()
					fileSize: getEnvironmentDefaults().maxSize * 1e6, // in bytes
					// Maximum number of non-file fields.
					fields: 1,
					// Maximum number of file fields.
					files: 1
				}
			},
			async (field: MultipartField) => {
				/*
					Keep non-files fields in Request.body.
					Since fields get processed in sequence, depending on the order at which they were defined,
					chunked uploads data must be set before the files[] field which contain the actual file.
				*/
				if (field.truncated) {
					// Re-map Dropzone chunked uploads keys so people can manually use the API without prepending 'dz'
					let name = field.name;
					if (name.startsWith('dz')) {
						name = name.replace(/^dz/, '');
					}

					body[name] = field.value;
					return;
				}

				// Process files immediately and push into Request.files array
				if (field.file) {
					if (field.name !== 'files[]') {
						throw new Error(`Unexpected file-type field: ${field.name}`);
					}

					// Push immediately as we will only be adding props into the file object down the line
					const file: FileBasic = {
						name: '',
						identifier: '',
						extension: '',
						original: field.file.name ?? '',
						type: field.mime_type,
						size: 0,
						hash: '',
						ip: req.ip
					};
					files.push(file);

					file.extension = getExtension(file.original);
					// TODO: Check if extension is blocked

					file.identifier = await getUniqueFileIdentifier();
					if (!file.identifier) {
						throw new Error('Couldnt allocate identifier for file');
					}

					file.name = `${file.identifier}${file.extension}`;

					const readStream = field.file.stream;
					let writeStream: WriteStream | undefined;
					let hashStream: NodeHash<NodeHashReader> | undefined;

					// Write the file into disk, and supply required props into file object
					await new Promise<void>((resolve, reject) => {
						// Ensure this Promise's status can be asserted later
						const _resolve = () => {
							file.promised = true;
							return resolve();
						};

						readStream.once('error', reject);

						writeStream = jetpack.createWriteStream(path.join(uploadPath, file.name));
						hashStream = blake3.createHash();

						// Re-init stream errors listeners for this Request
						writeStream.once('error', reject);
						hashStream.once('error', reject);

						readStream.pause();
						readStream.on('data', data => {
							log.debug('readStream:data');
							// .dispose() will destroy this internal component,
							// so use it as an indicator of whether the hashStream has been .dispose()'d
							// @ts-ignore
							if (hashStream?.hash?.hash) {
								hashStream.update(data);
							}
						});

						// We immediately listen for writeStream's finish event
						writeStream.once('finish', () => {
							log.debug('writeStream:finish');
							if (writeStream?.bytesWritten) {
								file.size = writeStream.bytesWritten;
							}
							// @ts-ignore
							if (hashStream?.hash?.hash) {
								const hash = hashStream.digest('hex');
								file.hash = file.size === 0 ? '' : hash;
							}
							return _resolve();
						});

						// Pipe readStream to writeStream
						log.debug('readStream.pipe(writeStream)');
						readStream.pipe(writeStream);
					}).catch(error => {
						// Dispose of unfinished write & hasher streams
						if (writeStream && !writeStream.destroyed) {
							writeStream.destroy();
						}
						// @ts-ignore
						if (hashStream?.hash?.hash) {
							hashStream.dispose();
						}

						// Re-throw error
						throw error;
					});

					if (file.size === 0) {
						throw new Error('Zero-bytes files are not allowed');
					}
				}
			}
		)
		.then(() => true)
		.catch(error => {
			// Clean up temp files (do not wait)
			void cleanUpFiles();

			// Response.multipart() itself may throw string errors
			let errorString;
			if (typeof error !== 'string') {
				errorString = error.toString();
			}
			res.status(400).json({ message: errorString });
			log.debug(errorString);
			return false;
		});

	log.debug(`req.multipart(): ${inspect(multipart)}`);
	if (!multipart) return res.end();

	log.debug(inspect(files));
	if (!files.length) {
		return res.status(400).json({ message: 'No files' });
	}

	if (files.length > 1) {
		return res.status(400).json({ message: 'Can only upload one file at a time' });
	}

	// If for some reason Request.multipart() resolves before a file's Promise.
	// Typically caused by something hanging up longer than
	// uWebSockets.js' internal security timeout (10 seconds).
	if (files.some(file => !file.promised)) {
		// Clean up temp (do not wait)
		void cleanUpFiles();
		return;
	}

	const stored = await storeFileToDb(req.user, files[0]);
	// TODO
	// @ts-ignore
	const file = constructFilePublicLink(req, stored.file);

	const result: UploadResult = {
		message: 'Successfully uploaded the file.',
		name: file.name,
		hash: file.hash,
		size: file.size,
		url: file.url,
		thumb: file.thumb,
		deleteUrl: `${getHost(req)}/api/file/${file.id}`
	};
	if (stored.repeated) {
		result.repeated = true;
	}

	return res.json(result);
};
