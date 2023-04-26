import * as blake3 from 'blake3';
import jetpack from 'fs-jetpack';
import { utc } from 'moment';
import Zip from 'adm-zip';
import path from 'node:path';
import { setTimeout, clearTimeout } from 'node:timers';
// import { inspect } from 'node:util';
import log from '../utils/Log';
import randomstring from 'randomstring';
import { v4 as uuidv4 } from 'uuid';

import prisma from '../structures/database';
import { generateThumbnails, getFileThumbnail, removeThumbs } from './Thumbnails';
import { getHost } from './Util';
import { SETTINGS } from '../structures/settings';

import type { Album, ExtendedFile, File, FileInProgress, RequestUser, User } from '../structures/interfaces';
import type { NodeHash, NodeHashReader } from 'blake3';
import type { WriteStream } from 'node:fs';
import type { FastifyRequest, FastifyReply } from 'fastify';

const fileIdentifierMaxTries = 5;

const preserveExtensions = [
	/\.tar\.\w+/i // tarballs
];
export const uploadPath = path.join(__dirname, '../../../', 'uploads');

export const isExtensionBlocked = (extension: string) => {
	if (!extension && SETTINGS.blockNoExtension) return true;
	return SETTINGS.blockedExtensions.includes(extension);
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

export const unholdFileIdentifiers = (res: FastifyReply): void => {
	// @ts-ignore
	if (!res.locals?.identifiers) return;

	// @ts-ignore
	for (const identifier of res.locals.identifiers) {
		heldFileIdentifiers.delete(identifier);
		// log.debug(`File.heldFileIdentifiers: ${inspect(heldFileIdentifiers)} -> ${inspect(identifier)}`);
	}

	// @ts-ignore
	delete res.locals.identifiers;
};

export const getUniqueFileIdentifier = async (res?: FastifyReply): Promise<string | null> => {
	for (let i = 0; i < fileIdentifierMaxTries; i++) {
		const identifier = randomstring.generate({
			length: SETTINGS.generatedFilenameLength,
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
					// @ts-ignore
					if (!res.locals.identifiers) {
						// @ts-ignore
						res.locals.identifiers = [];
					}

					// @ts-ignore
					res.locals.identifiers.push(identifier);
				}

				// log.debug(`File.heldFileIdentifiers: ${inspect(heldFileIdentifiers)}`);
				return identifier;
			}
		}
	}

	log.error('Couldnt allocate identifier for file');
	return null;
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

export const getFilenameFromPath = (fullPath: string) => fullPath.replace(/^.*[/\\]/, ''); // eslint-disable-line no-useless-escape

export const createZip = (files: string[], albumUuid: string) => {
	try {
		const zip = new Zip();
		for (const file of files) {
			zip.addLocalFile(path.join(uploadPath, file));
		}

		zip.writeZip(path.join(__dirname, '../../../', 'uploads', 'zips', `${albumUuid}.zip`));
	} catch (error) {
		log.error(error);
	}
};

export const constructFilePublicLink = (req: FastifyRequest, file: File) => {
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

export const storeFileToDb = async (
	user: RequestUser | User | undefined,
	file: FileInProgress,
	albumId?: number | null
) => {
	const dbFile = await prisma.files.findFirst({
		where: {
			hash: file.hash,
			size: file.size,
			// Must be null for guest uploads,
			// to ensure guests uploads will only be matched against other guest uploads
			user: {
				id: user ? user.id : undefined
			}
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

	log.debug('albumId:', albumId);
	if (albumId && albumId !== null && albumId !== undefined) {
		const fileId = await prisma.files.create({
			data: {
				...data,
				albums: {
					connect: {
						id: albumId
					}
				}
			}
		});

		return {
			file: {
				id: fileId.id,
				...data
			}
		};
	} else {
		const fileId = await prisma.files.create({
			data
		});

		return {
			file: {
				id: fileId.id,
				...data
			}
		};
	}
};

export const saveFileToAlbum = async (albumId: number, fileId: number) => {
	const now = utc().toDate();
	await prisma.files.update({
		where: {
			id: fileId
		},
		data: {
			albums: {
				connect: {
					id: albumId
				}
			}
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
		// eslint-disable-next-line no-param-reassign
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
