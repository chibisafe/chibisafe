import jetpack from 'fs-jetpack';
import { utc } from 'moment';
import Zip from 'adm-zip';
import path from 'path';
import log from 'fancy-log';
import randomstring from 'randomstring';

import prisma from '../structures/database';
import { generateThumbnails, getFileThumbnail, removeThumbs } from './Thumbnails';
import { getHost, getConfig } from './Util';

import type { File, ExtendedFile, ExtendedFileWithData, Album, User } from '../structures/interfaces';
import type { Request, Response } from 'hyper-express';

const preserveExtensions = ['.tar.gz', '.tar.z', '.tar.bz2', '.tar.lzma', '.tar.lzo', '.tar.xz'];
export const uploadPath = path.join(__dirname, '../../../', 'uploads');

export const isExtensionBlocked = async (extension: string) =>
	(await getConfig()).blockedExtensions.includes(extension);
export const getMimeFromType = (fileTypeMimeObj: Record<string, null>) => fileTypeMimeObj.mime;

export const getUniqueFilename = (extension: string) => {
	const retry: any = async (i = 0) => {
		const filename =
			randomstring.generate({
				length: (await getConfig()).generatedFilenameLength,
				capitalization: 'lowercase'
			}) + extension;

		// TODO: Change this to look for the file in the db instead of in the filesystem
		const exists = jetpack.exists(path.join(uploadPath, filename));
		if (!exists) return filename;
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

export const deleteAllFilesFromUser = async (id: number) => {
	try {
		const files = await prisma.files.findMany({
			where: {
				userId: id
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

export const storeFileToDb = async (req: Request, res: Response, user: User, file: ExtendedFileWithData) => {
	const dbFile = await prisma.files.findFirst({
		where: {
			hash: file.data.hash,
			size: file.data.size,
			userId: user.id ? user.id : undefined
		}
	});

	if (dbFile) {
		await fileExists(req, res, dbFile, file.data.filename);
		return;
	}

	const now = utc().toDate();
	const data = {
		userId: user.id ? user.id : undefined,
		name: file.data.filename,
		original: file.data.originalName,
		type: file.data.mimeType,
		size: file.data.size,
		hash: file.data.hash,
		ip: req.ip,
		createdAt: now,
		editedAt: now
	};
	void generateThumbnails(file.data.filename);

	const fileId = await prisma.files.create({
		data
	});

	return {
		file: data,
		id: fileId.id
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

export const getExtension = (filename: string) => {
	// Always return blank string if the filename does not seem to have a valid extension
	// Files such as .DS_Store (anything that starts with a dot, without any extension after) will still be accepted
	if (!/\../.test(filename)) return '';

	let lower = filename.toLowerCase(); // due to this, the returned extname will always be lower case
	let multi = '';
	let extname = '';

	// check for multi-archive extensions (.001, .002, and so on)
	if (/\.\d{3}$/.test(lower)) {
		multi = lower.slice(lower.lastIndexOf('.') - lower.length);
		lower = lower.slice(0, lower.lastIndexOf('.'));
	}

	// check against extensions that must be preserved
	for (const extPreserve of preserveExtensions) {
		if (lower.endsWith(extPreserve)) {
			extname = extPreserve;
			break;
		}
	}

	if (!extname) {
		extname = lower.slice(lower.lastIndexOf('.') - lower.length); // path.extname(lower)
	}

	return extname + multi;
};
