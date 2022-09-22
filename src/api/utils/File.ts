import jetpack from 'fs-jetpack';
import { utc } from 'moment';
import Zip from 'adm-zip';
import path from 'path';
import log from '../utils/Log';
import randomstring from 'randomstring';
import { v4 as uuidv4 } from 'uuid';

import prisma from '../structures/database';
import { generateThumbnails, getFileThumbnail, removeThumbs } from './Thumbnails';
import { getConfig, getEnvironmentDefaults, getHost } from './Util';

import type { Album, ExtendedFile, File, FileBasic, RequestUser, User } from '../structures/interfaces';
import type { Request, Response } from 'hyper-express';

const preserveExtensions = [
	/\.tar\.\w+/i // tarballs
];
export const uploadPath = path.join(__dirname, '../../../', 'uploads');

export const isExtensionBlocked = async (extension: string) =>
	(await getConfig()).blockedExtensions.includes(extension);
export const getMimeFromType = (fileTypeMimeObj: Record<string, null>) => fileTypeMimeObj.mime;

/*
	TODO: Where to put this?
	This is necesary, because when we first allocate an identifier,
	it will not immediately be pushed into db,
	which means the rest of the service has no context as to whether
	that identifier is currently being used by other upload in progress or not.
	In-memory, thus only for single-thread, thoughts?
*/
export const heldFileIdentifiers = new Set();

export const unholdFileIdentifiers = (res: Response): void => {
	if (!res.locals.identifiers) return;

	for (const identifier of res.locals.identifiers) {
		heldFileIdentifiers.delete(identifier);
		log.debug(`Unheld identifier ${String(identifier)}.`);
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
				// Unhold identifier once the Response has been sent
				if (res) {
					if (!res.locals.identifiers) {
						res.locals.identifiers = [];
						res.once('finish', () => {
							unholdFileIdentifiers(res);
						});
					}
					res.locals.identifiers.push(identifier);
				}
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
		zip.writeZip(path.join(__dirname, '../../../', 'uploads', 'zips', `${album.userId}-${album.id}.zip`));
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

export const storeFileToDb = async (user: RequestUser | User | undefined, fileData: FileBasic) => {
	const dbFile = await prisma.files.findFirst({
		where: {
			hash: fileData.hash,
			size: fileData.size,
			userId: user?.id ?? undefined
		}
	});

	if (dbFile) {
		// Delete temp file (do not wait)
		void deleteFile(fileData.name);
		heldFileIdentifiers.delete(fileData.identifier);

		return {
			file: dbFile,
			repeated: true
		};
	}

	const now = utc().toDate();
	const data = {
		userId: user?.id ?? undefined,
		uuid: uuidv4(),
		name: fileData.name,
		original: fileData.original,
		type: fileData.type,
		size: fileData.size,
		hash: fileData.hash,
		ip: fileData.ip,
		createdAt: now,
		editedAt: now
	};
	void generateThumbnails(fileData.name);

	const fileId = await prisma.files.create({
		data
	});
	heldFileIdentifiers.delete(fileData.identifier);

	const file: File = {
		id: fileId.id,
		...data
	};
	return {
		file
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
