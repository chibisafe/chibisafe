// NOTE: Should this file be named as such?

import type { MultipartField, Response } from 'hyper-express';

import * as blake3 from 'blake3';
import jetpack from 'fs-jetpack';
import path from 'path';
import { inspect } from 'util';

import {
	chunksData,
	cleanUpChunks,
	constructFilePublicLink,
	deleteFile,
	getExtension,
	getUniqueFileIdentifier,
	initChunks,
	storeFileToDb,
	unholdFileIdentifiers,
	uploadPath
} from '../../utils/File';
import log from '../../utils/Log';
import { getEnvironmentDefaults, getHost, unlistenEmitters } from '../../utils/Util';

import type { NodeHash, NodeHashReader } from 'blake3';
import type { WriteStream } from 'fs';
import type { ChunksData } from '../../utils/File';
import type { File, FileInProgress, RequestWithOptionalUser, RouteOptions } from '../../structures/interfaces';

interface UploadResult {
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
	}
	// debug: true
};

const uploadFile = async (req: RequestWithOptionalUser, res: Response) => {
	// Init empty Request.body and Request.files
	const body: { [index: string]: string } = {};
	const files: FileInProgress[] = [];

	const unfreezeChunksData = () => {
		files.forEach(file => {
			if (!file.chunksData) return;
			file.chunksData.processing = false;
		});
	};

	const cleanUpFiles = async () => {
		// Unhold file identifiers generated via File.getUniqueFileIdentifier()
		unholdFileIdentifiers(res);
		// Delete temp files
		await Promise.all(
			files.map(async file => {
				if (!file.name) return;
				return deleteFile(file.name);
			})
		);
	};

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
					// Dropzone.js will add 6 extra fields for chunked uploads.
					// We don't use them for anything else.
					fields: 6,
					// Maximum number of file fields.
					// TODO: Setting for max files per request
					files: 10
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

					body[name] = field.value || '';
					return;
				}

				// Process files immediately and push into Request.files array
				if (field.file) {
					if (field.name !== 'files[]') {
						throw new Error(`Unexpected file-type field: ${field.name}`);
					}

					// Push immediately as we will only be adding props into the file object down the line
					const file: FileInProgress = {
						name: '',
						extension: '',
						path: '',
						original: field.file.name ?? '',
						type: field.mime_type || 'application/octet-stream',
						size: 0,
						hash: '',
						ip: req.ip
					};
					files.push(file);

					const isChunk = typeof body.uuid === 'string' && Boolean(body.uuid);
					if (isChunk && files.length > 1) {
						throw new Error('Chunked uploads may only be uploaded 1 chunk at a time');
					}

					file.extension = getExtension(file.original);
					// TODO: Check if extension is blocked

					if (isChunk) {
						// Re-map UUID property to IP-specific UUID
						const uuid = `${file.ip}_${body.uuid}`;
						// Calling initChunks() will also reset the chunked uploads' timeout
						file.chunksData = await initChunks(uuid);
						file.name = file.chunksData.name;
						file.path = file.chunksData.path;
					} else {
						const identifier = await getUniqueFileIdentifier(res);
						if (!identifier) {
							throw new Error('Couldnt allocate identifier for file');
						}
						file.name = `${identifier}${file.extension}`;
						file.path = path.join(uploadPath, file.name);
					}

					const readStream = field.file.stream;
					let writeStream: WriteStream | undefined;
					let hashStream: NodeHash<NodeHashReader> | undefined;
					let _reject: ((reason?: any) => void) | undefined;

					// Write the file into disk, and supply required props into file object
					await new Promise<void>((resolve, reject) => {
						// Keep reference to Promise's reject function to allow unlistening events
						_reject = reject;

						// Ensure this Promise's status can be asserted later
						const _resolve = () => {
							file.promised = true;
							return resolve();
						};

						if (file.chunksData) {
							writeStream = file.chunksData.writeStream;
							hashStream = file.chunksData.hashStream;
						} else {
							writeStream = jetpack.createWriteStream(file.path);
							hashStream = blake3.createHash();
						}

						// This should technically never happen, but typings
						if (!writeStream || !hashStream) return _reject(new Error('Missing destination streams'));

						readStream.once('error', _reject);

						// Re-init stream errors listeners for this Request
						writeStream.once('error', _reject);
						hashStream.once('error', _reject);

						// Ensure readStream will only be resumed later down the line by readStream.pipe()
						log.debug('readStream.pause()');
						readStream.pause();
						readStream.on('data', data => {
							// log.debug('readStream -> data');
							// .dispose() will destroy this internal component,
							// so use it as an indicator of whether the hashStream has been .dispose()'d
							// @ts-ignore -- required because typings for "hash" property is set to private
							if (hashStream?.hash?.hash) {
								hashStream.update(data);
							}
						});

						if (isChunk) {
							// We listen for readStream's end event
							readStream.once('end', () => {
								log.debug('readStream -> end');
								_resolve();
							});
						} else {
							// We immediately listen for writeStream's finish event
							writeStream.once('finish', () => {
								log.debug('writeStream -> finish');
								if (writeStream?.bytesWritten !== undefined) {
									file.size = writeStream.bytesWritten;
								}
								// @ts-ignore
								if (hashStream?.hash?.hash) {
									const hash = hashStream.digest('hex');
									file.hash = file.size === 0 ? '' : hash;
								}
								return _resolve();
							});
						}

						// Pipe readStream to writeStream
						// Do not end writeStream when readStream finishes if it's a chunk upload
						log.debug(`readStream.pipe(writeStream, { end: ${inspect(!isChunk)} })`);
						readStream.pipe(writeStream, { end: !isChunk });
					})
						.catch(error => {
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
						})
						.finally(() => {
							if (isChunk) {
								// Unlisten streams' error event for this Request if it's a chunk upload
								unlistenEmitters([writeStream, hashStream], 'error', _reject);
							}
						});

					if (file.size === 0) {
						throw new Error('Zero-bytes files are not allowed');
					}
				}
			}
		)
		.catch(error => {
			// Clean up temp files and held identifiers (do not wait)
			void cleanUpFiles();
			unfreezeChunksData();

			// Response.multipart() itself may throw string errors
			res.status(500).json({ message: error instanceof Error ? error.message : String(error) });
			return false;
		});
	log.debug(`req.multipart() awaited: ${inspect(multipart)}`);
	if (multipart === false) return;

	if (!files.length) {
		return res.status(400).json({ message: 'No files' });
	}

	// If for some reason Request.multipart() resolves before a file's Promise.
	// Typically caused by something hanging up longer than
	// uWebSockets.js' internal security timeout (10 seconds).
	if (files.some(file => !file.promised)) {
		// Clean up temp files and held identifiers (do not wait)
		void cleanUpFiles();
		unfreezeChunksData();
		log.debug("Request.multipart() resolved before a file's Promise");
		return;
	}

	// If the uploaded file is a chunk, then just say that it was a success.
	// NOTE: We loop through Request.files for clarity,
	// but we will actually have already rejected the Request
	// if it has more than 1 file while being a chunk upload.
	if (files.some(file => file.chunksData)) {
		files.forEach(file => {
			if (!file.chunksData) return;
			file.chunksData.chunks++;
			// Mark as ready to accept more chunk uploads or to finalize
			file.chunksData.processing = false;
		});
		return res.json({ success: true });
	}

	return files;
};

const finishChunks = async (req: RequestWithOptionalUser, res: Response) => {
	// TODO: The following bits and pieces in checking user inputs format
	// can probably be streamlined using runtime type checking library? io-ts? Thoughts?
	const _body = await req.json();

	if (
		!Array.isArray(_body?.files) ||
		!_body.files.length ||
		_body.files.some((file: any) => typeof file !== 'object' || !file.uuid)
	) {
		return res.status(400).json({ message: 'Bad request.' });
	}

	// Re-init as a new variable with TS typing
	const body: {
		files: {
			uuid: string;
			original?: string;
			size?: number;
			type?: string;
			chunksData?: ChunksData;
		}[];
	} = _body;

	// Re-map UUID property to IP-specific UUID
	body.files.forEach(file => {
		file.uuid = `${req.ip}_${String(file.uuid)}`;
		file.chunksData = chunksData.get(file.uuid);
	});

	if (body.files.some(file => !file.chunksData || file.chunksData.processing)) {
		return res.status(400).json({
			message: 'Invalid file UUID, chunks data had already timed out, or is still processing. Try again?'
		});
	}

	const files: FileInProgress[] = [];

	try {
		await Promise.all(
			body.files.map(async file => {
				// TODO
				if (!file.chunksData?.writeStream || !file.chunksData.hashStream) return;

				// Suspend timeout
				// If the chunk errors out there, it will be immediately cleaned up anyway
				file.chunksData.clearTimeout();

				// Conclude write and hasher streams
				// log.debug('file.chunksData.writeStream.end()');
				file.chunksData.writeStream.end();
				const bytesWritten = file.chunksData.writeStream.bytesWritten;
				const hash = file.chunksData.hashStream.digest('hex');

				if (file.chunksData.chunks < 2) {
					throw new Error('Invalid chunks count');
				}

				const extension = typeof file.original === 'string' ? getExtension(file.original) : '';
				// TODO: Check if extension is blocked

				let size: number | undefined = typeof file.size === 'number' ? file.size : undefined;
				if (size === undefined) {
					size = bytesWritten;
				} else if (size !== bytesWritten) {
					// If client reports actual total size, confirm match
					throw new Error(
						`Written bytes (${bytesWritten}) does not match actual size reported by client (${String(
							size
						)})`
					);
				}

				if (size === 0) {
					throw new Error('Empty files are not allowed.');
				}
				// TODO: Check file size early

				const tmpfile = path.join(file.chunksData.root, file.chunksData.name);

				// Double-check file size
				const stat = await jetpack.inspect(tmpfile);
				if (stat && stat.size !== size) {
					throw new Error(
						`Resulting physical file size (${stat.size}) does not match expected size (${String(size)})`
					);
				}

				// Generate name
				const identifier = await getUniqueFileIdentifier(res);
				if (!identifier) {
					throw new Error('Couldnt allocate identifier for file');
				}
				const name = `${identifier}${extension}`;

				// Move tmp file to final destination
				const destination = path.join(uploadPath, name);
				await jetpack.moveAsync(tmpfile, destination);

				// Continue even when encountering errors
				await cleanUpChunks(file.uuid).catch(log.error);

				files.push({
					name,
					original: file.original ?? '',
					path: destination,
					extension,
					// eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
					type: file.type || 'application/octet-stream',
					size,
					hash,
					ip: req.ip
				});
			})
		);

		log.debug(inspect(files));
		return files;
	} catch (error) {
		// Unhold file identifiers generated via File.getUniqueFileIdentifier()
		unholdFileIdentifiers(res);

		// Unlink temp files (do not wait)
		void Promise.all(body.files.map(file => cleanUpChunks(file.uuid).catch(log.error)));

		return res
			.status(500)
			.json({ message: error instanceof Error ? error.message : 'An unexpected error occurred.' });
	}
};

export const run = async (req: RequestWithOptionalUser, res: Response) => {
	const multipart = req.is('multipart/form-data');
	const json = req.is('application/json');
	if (!multipart && !json) {
		return res
			.status(400)
			.json({ message: 'Request Content-Type must be either multipart/form-data or application/json.' });
	}

	let files;
	if (multipart) {
		files = await uploadFile(req, res);
	} else {
		files = await finishChunks(req, res);
	}

	// Assumes error already sent by their respective handler functions
	if (!Array.isArray(files)) return;

	const stored: {
		file: File;
		repeated?: boolean;
	}[] = [];
	for (const file of files) {
		log.debug('await storeFileToDb()');
		stored.push(await storeFileToDb(req.user, file));
	}

	return res.json({
		message: 'Successfully uploaded the file(s).',
		files: stored.map(entry => {
			const extended = constructFilePublicLink(req, entry.file);
			const result: UploadResult = {
				name: extended.name,
				hash: extended.hash,
				size: extended.size,
				url: extended.url,
				thumb: extended.thumb,
				deleteUrl: `${getHost(req)}/api/file/${extended.id}`
			};
			if (entry.repeated) {
				result.repeated = true;
			}
			return result;
		})
	});
};
