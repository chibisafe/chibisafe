import * as blake3 from 'blake3';
import jetpack from 'fs-jetpack';
import { utc } from 'moment';
import Zip from 'adm-zip';
import path from 'path';
// import { inspect } from 'util';
import log from '../utils/Log';
import randomstring from 'randomstring';
import { v4 as uuidv4 } from 'uuid';

import prisma from '../structures/database';
import { generateThumbnails, getFileThumbnail, removeThumbs } from './Thumbnails';
import { getEnvironmentDefaults, getHost } from './Util';

import type { Album, ExtendedFile, File, FileInProgress, RequestUser, User } from '../structures/interfaces';
import type { NodeHash, NodeHashReader } from 'blake3';
import type { WriteStream } from 'fs';
import type { Request, Response } from 'hyper-express';

const preserveExtensions = [
	/\.tar\.\w+/i // tarballs
];
export const uploadPath = path.join(__dirname, '../../../', 'uploads');
// Note: network drives typically don't support "append" operation used in our chunking method.
// so if you really want to use network drives, you should symlink the chunks folder and try.
export const chunksPath = path.join(uploadPath, 'chunks');

const chunkedUploadsTimeout = getEnvironmentDefaults().chunkedUploadsTimeout;

export const chunksData: Map<string, ChunksData> = new Map();

export class ChunksData {
	public readonly uuid: string;
	public readonly root: string;
	public readonly name: string = 'tmp';
	public readonly path: string;
	public chunks = 0;
	public writeStream?: WriteStream;
	public hashStream?: NodeHash<NodeHashReader>;
	// Immediately mark this chunked upload as currently processing
	public processing = true;
	private _timeout?: NodeJS.Timeout;

	public constructor(uuid: string) {
		this.uuid = uuid;
		this.root = path.join(chunksPath, this.uuid);
		this.path = path.join(this.root, this.name);
	}

	private onTimeout() {
		// eslint-disable-next-line @typescript-eslint/no-use-before-define
		void cleanUpChunks(this.uuid);
	}

	public setTimeout(delay: number) {
		this.clearTimeout();
		this._timeout = setTimeout(this.onTimeout.bind(this), delay);
	}

	public clearTimeout() {
		if (this._timeout) {
			clearTimeout(this._timeout);
		}
	}
}

export const initChunks = async (uuid: string): Promise<ChunksData> => {
	// This returns reference to the ChunksData instance, if already exists
	let data = chunksData.get(uuid);

	// Wait for the first spawned init tasks
	if (data?.processing) {
		throw new Error('Previous chunk upload is still being processed. Parallel chunked uploads is not supported.');
	}

	// Otherwise let's init a new one
	if (!data) {
		data = new ChunksData(uuid);
		chunksData.set(uuid, data);
		await jetpack.dirAsync(data.root);
		// Init write & hasher streams
		data.writeStream = jetpack.createWriteStream(data.path, { flags: 'a' });
		data.hashStream = blake3.createHash();
	}

	// Reset its timeout
	data.setTimeout(chunkedUploadsTimeout);
	return data;
};

export const cleanUpChunks = async (uuid: string): Promise<void> => {
	const data = chunksData.get(uuid);
	if (!data) return;

	// Dispose of unfinished write & hasher streams
	if (data.writeStream && !data.writeStream.destroyed) {
		data.writeStream.destroy();
	}
	// @ts-ignore
	if (data.hashStream?.hash?.hash) {
		data.hashStream.dispose();
	}

	// Remove UUID dir
	await jetpack.removeAsync(data.root).catch(error => {
		// Re-throw non-ENOENT error
		if (error.code !== 'ENOENT') log.error(error);
	});

	// Delete cached chunks data
	chunksData.delete(uuid);
};

export const isExtensionBlocked = (extension: string) => {
	if (!extension && getEnvironmentDefaults().blockNoExtension) return true;
	return getEnvironmentDefaults().blockedExtensions.includes(extension);
};
export const getMimeFromType = (fileTypeMimeObj: Record<string, null>) => fileTypeMimeObj.mime;

/*
	TODO: Where to put this?
	This is necesary, because when we first allocate an identifier,
	it will not immediately be pushed into db,
	which means the rest of the service has no context as to whether
	that identifier is currently being used by other upload in progress or not.
	In-memory, thus only for single-thread, thoughts?
*/
const heldFileIdentifiers = new Set();

export const unholdFileIdentifiers = (res: Response): void => {
	if (!res.locals.identifiers) return;

	for (const identifier of res.locals.identifiers) {
		heldFileIdentifiers.delete(identifier);
		// log.debug(`File.heldFileIdentifiers: ${inspect(heldFileIdentifiers)} -> ${inspect(identifier)}`);
	}

	delete res.locals.identifiers;
};

export const getUniqueFileIdentifier = (res?: Response): string | null => {
	const retry: any = async (i = 0) => {
		const identifier = randomstring.generate({
			// TODO: Load from config
			length: getEnvironmentDefaults().generatedFilenameLength,
			capitalization: 'lowercase'
		});

		if (!heldFileIdentifiers.has(identifier)) {
			heldFileIdentifiers.add(identifier);

			/*
				We use $queryRaw() because we need to ignore extension when finding existing matches,
				and to do so we need to use SQL LIKE operator, which is still not available in Prisma
				for SQLite as a shorthand function (supposedly already implemented PostgreSQL, however).
				https://github.com/prisma/prisma/discussions/3159
				https://github.com/prisma/prisma/issues/9414
			*/
			const exists = await prisma.$queryRaw<{ id: number }[]>`
				SELECT id from files
				WHERE name LIKE ${`${identifier}.%`}
				LIMIT 1;
			`;

			if (exists.length) {
				heldFileIdentifiers.delete(identifier);
			} else {
				/*
					If Response is specified, push identifier into its locals object,
					allowing automatic removal once the Response ends.
				*/
				if (res) {
					if (!res.locals.identifiers) {
						res.locals.identifiers = [];
						res.once('finish', () => {
							unholdFileIdentifiers(res);
						});
					}
					res.locals.identifiers.push(identifier);
				}
				// log.debug(`File.heldFileIdentifiers: ${inspect(heldFileIdentifiers)}`);
				return identifier;
			}
		}

		if (i < 5) return retry(i + 1);
		log.error('Couldnt allocate identifier for file');
		return null;
	};

	return retry();
};

export const deleteFile = async (filename: string, deleteFromDB = false) => {
	const thumbName = getFileThumbnail(filename);
	try {
		await jetpack.removeAsync(path.join(uploadPath, filename));
		if (thumbName) await removeThumbs(thumbName);

		if (deleteFromDB) {
			await prisma.files.deleteMany({
				where: {
					name: filename
				}
			});
		}
	} catch (error) {
		log.error(`There was an error removing the file < ${filename} >`);
		log.error(error);
	}
};

export const deleteAllFilesFromAlbum = async (id: number) => {
	try {
		const fileAlbums = await prisma.albumsFiles.findMany({
			where: {
				albumId: id
			},
			select: {
				fileId: true
			}
		});

		for (const fileAlbum of fileAlbums) {
			const file = await prisma.files.findUnique({
				where: {
					id: fileAlbum.fileId
				}
			});

			if (!file?.name) continue;

			await deleteFile(file.name, true);
		}
	} catch (error) {
		log.error(error);
	}
};

export const deleteAllFilesFromUser = async (uuid: string) => {
	try {
		const files = await prisma.files.findMany({
			where: {
				uuid
			}
		});

		for (const file of files) {
			await deleteFile(file.name, true);
		}
	} catch (error) {
		log.error(error);
	}
};

export const deleteAllFilesFromTag = async (id: number) => {
	try {
		const fileTags = await prisma.fileTags.findMany({
			where: {
				tagId: id
			}
		});
		for (const fileTag of fileTags) {
			const file = await prisma.files.findFirst({
				where: {
					id: fileTag.fileId
				},
				select: {
					name: true
				}
			});
			if (!file) continue;
			await deleteFile(file.name, true);
		}
	} catch (error) {
		log.error(error);
	}
};

export const getFilenameFromPath = (fullPath: string) => fullPath.replace(/^.*[\\\/]/, ''); // eslint-disable-line no-useless-escape

export const createZip = (files: string[], album: Album) => {
	try {
		const zip = new Zip();
		for (const file of files) {
			zip.addLocalFile(path.join(uploadPath, file));
		}
		zip.writeZip(path.join(__dirname, '../../../', 'uploads', 'zips', `${album.uuid}.zip`));
	} catch (error) {
		log.error(error);
	}
};

export const constructFilePublicLink = (req: Request, file: File) => {
	/*
		TODO: This wont work without a reverse proxy serving both
		the site and the API under the same domain. Pls fix.
	*/
	const extended: ExtendedFile = { ...file };
	const host = getHost(req);
	extended.url = `${host}/${extended.name}`;
	const { thumb, preview } = getFileThumbnail(extended.name) ?? {};
	if (thumb) {
		extended.thumb = `${host}/thumbs/${thumb}`;
		extended.thumbSquare = `${host}/thumbs/square/${thumb}`;
		extended.preview = preview && `${host}/thumbs/preview/${preview}`;
	}
	return extended;
};

/*
export const fileExists = (req: Request, res: Response, exists: File, filename: string) => {
	const file = constructFilePublicLink(req, exists);
	void res.json({
		message: 'Successfully uploaded the file.',
		name: file.name,
		hash: file.hash,
		size: file.size,
		url: file.url,
		thumb: file.thumb,
		deleteUrl: `${getHost(req)}/api/file/${file.id}`,
		repeated: true
	});

	return deleteFile(filename);
};
*/

export const storeFileToDb = async (user: RequestUser | User | undefined, file: FileInProgress) => {
	const dbFile = await prisma.files.findFirst({
		where: {
			hash: file.hash,
			size: file.size,
			// Must be null for guest uploads,
			// to ensure guests uploads will only be matched against other guest uploads
			userId: user ? user.id : null
		}
	});

	if (dbFile) {
		// Delete temp file (do not wait)
		void deleteFile(file.name);
		return {
			file: dbFile,
			repeated: true
		};
	}

	const now = utc().toDate();
	const data = {
		userId: user?.id ?? undefined,
		uuid: uuidv4(),
		name: file.name,
		original: file.original,
		type: file.type,
		size: file.size,
		hash: file.hash,
		ip: file.ip,
		createdAt: now,
		editedAt: now
	};
	void generateThumbnails(file.name);

	const fileId = await prisma.files.create({
		data
	});

	return {
		file: {
			id: fileId.id,
			...data
		}
	};
};

export const saveFileToAlbum = async (albumId: number, insertedId: number) => {
	if (!albumId) return;

	const now = utc().toDate();
	try {
		await prisma.albumsFiles.create({
			data: {
				albumId,
				fileId: insertedId
			}
		});
		await prisma.albums.update({
			where: {
				id: albumId
			},
			data: {
				editedAt: now
			}
		});
	} catch (error) {
		console.error(error);
	}
};

export const getExtension = (filename: string, lower = false): string => {
	// Always return blank string if the filename does not seem to have a valid extension
	// Files such as .DS_Store (anything that starts with a dot, without any extension after) will still be accepted
	if (!/\../.test(filename)) return '';

	let multi = '';
	let extension = '';

	// check for multi-archive extensions (.001, .002, and so on)
	if (/\.\d{3}$/.test(filename)) {
		multi = filename.slice(filename.lastIndexOf('.') - filename.length);
		filename = filename.slice(0, filename.lastIndexOf('.'));
	}

	// check against extensions that must be preserved
	for (const extPreserve of preserveExtensions) {
		const match = filename.match(extPreserve);
		if (match?.[0]) {
			extension = match[0];
			break;
		}
	}

	if (!extension) {
		extension = filename.slice(filename.lastIndexOf('.') - filename.length); // path.extname(filename)
	}

	const str = extension + multi;
	return lower ? str.toLowerCase() : str;
};
