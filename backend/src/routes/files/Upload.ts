import type { MultipartField, Response } from 'hyper-express';

import * as blake3 from 'blake3';
import jetpack from 'fs-jetpack';
import path from 'node:path';
import { inspect } from 'node:util';

import {
	chunksData,
	cleanUpChunks,
	constructFilePublicLink,
	deleteFile,
	getExtension,
	getUniqueFileIdentifier,
	initChunks,
	isExtensionBlocked,
	storeFileToDb,
	unholdFileIdentifiers,
	uploadPath
} from '../../utils/File';
import log from '../../utils/Log';
import { /* getConfig, */ getEnvironmentDefaults, getHost, unlistenEmitters } from '../../utils/Util';

import type { NodeHash, NodeHashReader } from 'blake3';
import type { WriteStream } from 'node:fs';
import type { ChunksData } from '../../utils/File';
import type {
	File,
	FileInProgress,
	RequestWithOptionalUser,
	RouteOptions,
	UploadResult
} from '../../structures/interfaces';

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

const busboyOptions = {
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
};

const unfreezeChunksData = (files: FileInProgress[], increase = false) => {
	for (const file of files) {
		if (!file.chunksData) continue;
		if (increase) file.chunksData.chunks++;
		file.chunksData.processing = false;
	}
};

const cleanUpFiles = async (files: FileInProgress[]) => {
	log.debug(`cleanUpFiles(${inspect(files.map(file => String(file.chunksData?.uuid ?? file.name)))})`);
	// Delete temp files
	await Promise.all(
		files.map(async file => {
			if (file.chunksData) {
				return cleanUpChunks(file.chunksData.uuid).catch(log.error);
			} else if (file.name) {
				return deleteFile(file.name);
			}
		})
	);
};

const uploadFile = async (req: RequestWithOptionalUser, res: Response) => {
	// Init empty body and files
	const body: { [index: string]: string } = {};
	const files: FileInProgress[] = [];

	log.debug(`await req.multipart()`);
	await req.multipart(busboyOptions, async (field: MultipartField) => {
		/*
			Keep non-files fields in body.
			Since fields get processed in sequence, depending on the order at which they were defined,
			chunked uploads data must be set before the "files[]"" field which contain the actual file.
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

		if (!field.file) return;

		// Push files immediately, as we will only be adding props into the file object down the line
		const file: FileInProgress = {
			field: field.name,
			name: '',
			extension: '',
			path: '',
			original: field.file.name ?? '',
			type: field.mime_type || 'application/octet-stream',
			size: -1,
			hash: '',
			ip: req.ip
		};
		files.push(file);

		// TODO -- for debug logging, 1-based index
		const _index = files.length;

		file.extension = getExtension(file.original);

		const isChunk = typeof body.uuid === 'string' && Boolean(body.uuid);
		if (isChunk) {
			// Re-map UUID property to IP-specific UUID
			const uuid = `${file.ip}_${body.uuid}`;
			// Calling initChunks() will also reset the chunked uploads' timeout
			// eslint-disable-next-line require-atomic-updates
			file.chunksData = await initChunks(uuid);
			file.name = file.chunksData.name;
			file.path = file.chunksData.path;
		} else {
			const identifier = await getUniqueFileIdentifier(res);
			// TODO Preferably we always have an identifier, to ensure incoming stream is always consumed
			if (!identifier) return;
			file.name = `${identifier}${file.extension}`;
			file.path = path.join(uploadPath, file.name);
		}

		const readStream = field.file.stream;
		let writeStream: WriteStream | undefined;
		let hashStream: NodeHash<NodeHashReader> | undefined;
		let _reject: ((reason?: any) => void) | undefined;

		// Write the file into disk, and supply required props into file object
		await new Promise<void>((resolve, reject) => {
			if (!field.file) {
				resolve();
				return;
			}

			// Keep reference to Promise's reject function to allow unlistening events
			_reject = reject;

			if (file.chunksData) {
				writeStream = file.chunksData.writeStream;
				hashStream = file.chunksData.hashStream;
			} else {
				writeStream = jetpack.createWriteStream(file.path);
				hashStream = blake3.createHash();
			}

			// This should technically never happen, but typings
			if (!writeStream || !hashStream) {
				reject(new Error('Missing destination streams'));
				return;
			}

			// Re-init stream errors listeners for this Request
			writeStream.once('error', reject);
			hashStream.once('error', reject);

			// Ensure readStream will only be resumed later down the line by readStream.pipe()
			readStream.pause();
			readStream.on('data', data => {
				// log.debug(`${_index}: readStream -> data`);
				// NodeHash.dispose() will destroy its internal component ".hash.hash",
				// so use it as an indicator of whether it has been disposed, before attempting to update.
				// @ts-ignore -- required because typings for "hash" property is set to private
				if (hashStream?.hash?.hash) {
					hashStream.update(data);
				}
			});

			if (file.chunksData) {
				// We listen for readStream's close event
				readStream.once('close', () => {
					log.debug(`${_index}: readStream -> close`);
					resolve();
				});
			} else {
				// We immediately listen for writeStream's finish event
				writeStream.once('finish', () => {
					log.debug(`${_index}: writeStream -> finish`);
					if (writeStream?.bytesWritten !== undefined) {
						file.size = writeStream.bytesWritten;
					}

					// @ts-ignore
					if (hashStream?.hash?.hash) {
						const hash = hashStream.digest('hex');
						file.hash = file.size === 0 ? '' : hash;
					}

					resolve();
				});
			}

			// Pipe readStream to writeStream
			// Do not end writeStream when readStream finishes if it's a chunk upload
			log.debug(`${_index}: readStream.pipe(writeStream, { end: ${inspect(!file.chunksData)} })`);
			readStream.pipe(writeStream, { end: !file.chunksData });

			// This is not supposed to be necessary,
			// but somehow the only way to get Hyper +6.4.4 to work here
			log.debug(`req.resume()`);
			// @ts-ignore
			req.resume();
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
				log.debug(inspect(error));
				throw error;
			})
			.finally(() => {
				if (!_reject || !file.chunksData) return;
				// Unlisten streams' error event for this Request if it's a chunk upload
				unlistenEmitters([writeStream, hashStream], 'error', _reject);
			});
	});

	log.debug(`req.multipart() awaited`);

	log.debug(`files.length: ${files.length}`);
	if (!files.length) {
		return res.status(400).json({ message: 'No files.' });
	}

	// Validate files
	try {
		for (const file of files) {
			if (file.field !== 'files[]') {
				throw new Error(`Unexpected file-type field: ${file.field}`);
			}

			if (isExtensionBlocked(file.extension)) {
				throw new Error(
					file.extension
						? `${file.extension.slice(1).toUpperCase()} files are not permitted.`
						: 'Files with no extension are not permitted.'
				);
			}

			if (file.size === 0) {
				throw new Error('Zero-bytes file is not allowed.');
			}
		}
	} catch (error: any) {
		// Unhold file identifiers generated via File.getUniqueFileIdentifier()
		unholdFileIdentifiers(res);

		// Clean up temp files and held identifiers (do not wait)
		void cleanUpFiles(files);
		unfreezeChunksData(files);

		return res.status(400).json({ message: error instanceof Error ? error.message : 'Bad request.' });
	}

	// If the uploaded file is a chunk, then just say that it was a success.
	if (files.some(file => file.chunksData)) {
		unfreezeChunksData(files, true);
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
	for (const file of body.files) {
		file.uuid = `${req.ip}_${String(file.uuid)}`;
		file.chunksData = chunksData.get(file.uuid);
	}

	if (body.files.some(file => !file.chunksData || file.chunksData.processing)) {
		return res.status(400).json({
			message: 'Invalid file UUID, chunks data had already timed out, or is still processing. Try again?'
		});
	}

	const files: FileInProgress[] = [];

	try {
		await Promise.all(
			body.files.map(async file => {
				if (!file.chunksData?.writeStream || !file.chunksData.hashStream) {
					throw new Error('Invalid chunks data.');
				}

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
				if (isExtensionBlocked(extension)) {
					throw new Error(
						extension
							? `${extension.slice(1).toUpperCase()} files are not permitted.`
							: 'Files with no extension are not permitted.'
					);
				}

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
				} else if (size > getEnvironmentDefaults().maxSize * 1e6) {
					throw new Error('File too large.');
				}

				const tmpfile = path.join(file.chunksData.root, file.chunksData.name);

				// Double-check file size
				const stat = await jetpack.inspectAsync(tmpfile);
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

		return files;
	} catch (error) {
		// Unhold file identifiers generated via File.getUniqueFileIdentifier()
		unholdFileIdentifiers(res);

		// Unlink temp files (do not wait)
		// eslint-disable-next-line promise/prefer-await-to-then
		void Promise.all(body.files.map(async file => cleanUpChunks(file.uuid).catch(log.error)));

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
	// TODO: Prisma does not have .createMany() support for SQLite,
	// so can not aggregrate multiple INSERTs into one query (?).
	log.debug(`await storeFileToDb(): ${files.length}`);
	for (const file of files) {
		stored.push(await storeFileToDb(req.user, file));
	}

	log.debug(`storeFileToDb() awaited: ${stored.length}`);

	return res.json({
		message: 'Successfully uploaded the file(s).',
		files: stored.map(entry => {
			const extended = constructFilePublicLink(req, entry.file);
			const result: UploadResult = {
				uuid: extended.uuid,
				name: extended.name,
				hash: extended.hash,
				size: extended.size,
				url: extended.url,
				thumb: extended.thumb,
				deleteUrl: req.user ? `${getHost(req)}/api/file/${extended.uuid}` : undefined
			};
			if (entry.repeated) {
				result.repeated = true;
			}

			return result;
		})
	});
};
