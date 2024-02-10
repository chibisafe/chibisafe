import path, { extname } from 'node:path';
import process from 'node:process';
import { URL, fileURLToPath } from 'node:url';
import { DeleteObjectsCommand } from '@aws-sdk/client-s3';
import { Blake3Hasher } from '@napi-rs/blake-hash';
import Zip from 'adm-zip';
import type { FastifyRequest } from 'fastify';
import jetpack from 'fs-jetpack';
import moment from 'moment';
import randomstring from 'randomstring';
import { v4 as uuidv4 } from 'uuid';
import prisma from '@/structures/database.js';
import type { FileInProgress, RequestUser, User } from '@/structures/interfaces.js';
import { SETTINGS } from '@/structures/settings.js';
import { log } from '@/utils/Logger.js';
import { generateThumbnails, getFileThumbnail, removeThumbs } from './Thumbnails.js';
import { getHost } from './Util.js';

const fileIdentifierMaxTries = 5;

const preserveExtensions = [
	/\.tar\.\w+/i // tarballs
];
export const uploadPath = fileURLToPath(new URL('../../../../uploads', import.meta.url));
export const watchPath = fileURLToPath(new URL('../../../../uploads/live', import.meta.url));
export const tmpUploadPath = fileURLToPath(new URL('../../../../uploads/tmp', import.meta.url));
export const quarantinePath = fileURLToPath(new URL('../../../../uploads/quarantine', import.meta.url));

export const isExtensionBlocked = (extension: string) => {
	if (!extension && SETTINGS.blockNoExtension) return true;
	return SETTINGS.blockedExtensions.includes(extension);
};

export const getMimeFromType = (fileTypeMimeObj: Record<string, null>) => fileTypeMimeObj.mime;

export const getUniqueFileIdentifier = async (): Promise<string | null> => {
	const options = {
		length: SETTINGS.generatedFilenameLength
	};

	if (!SETTINGS.enableMixedCaseFilenames || process.platform === 'win32') {
		// @ts-ignore
		options.capitalization = 'lowercase';
	}

	for (let i = 0; i < fileIdentifierMaxTries; i++) {
		const identifier = randomstring.generate(options);

		const exists = await prisma.$queryRaw<{ id: number }[]>`
		SELECT id from files
		WHERE name LIKE ${`${identifier}.%`}
		LIMIT 1;
	`;

		if (!exists.length) {
			return identifier;
		}
	}

	log.error('Couldnt allocate identifier for file');
	return null;
};

export const deleteTmpFile = async (uploadPath: string) => {
	try {
		await jetpack.removeAsync(uploadPath);
	} catch (error) {
		log.error(`There was an error removing the file at < ${uploadPath} >`);
		log.error(error);
	}
};

export const deleteFiles = async ({
	files,
	deleteFromDB = false
}: {
	deleteFromDB?: boolean;
	files: {
		isS3: boolean;
		isWatched: boolean;
		name: string;
		quarantine: boolean;
		quarantineFile: { name: string } | null;
		uuid: string;
	}[];
}) => {
	const s3Files = files.filter(file => file.isS3);
	const localFiles = files.filter(file => !file.isS3);

	try {
		if (s3Files.length) {
			const { createS3Client } = await import('@/structures/s3.js');
			const S3Client = createS3Client();

			const command = new DeleteObjectsCommand({
				Bucket: SETTINGS.S3Bucket,
				Delete: {
					Objects: s3Files.map(file => ({
						Key: file.quarantine ? `quarantine/${file.quarantineFile?.name}` ?? file.name : file.name
					})),
					Quiet: true
				}
			});

			await S3Client.send(command);
		}

		if (localFiles.length) {
			for (const file of localFiles) {
				if (file.quarantine) {
					await prisma.files.update({
						where: {
							uuid: file.uuid
						},
						data: {
							quarantine: false,
							quarantineFile: {
								delete: true
							}
						}
					});
				}

				await jetpack.removeAsync(
					path.join(
						file.quarantine ? quarantinePath : file.isWatched ? watchPath : uploadPath,
						file.quarantine ? file.quarantineFile?.name ?? file.name : file.name
					)
				);
			}
		}

		for (const file of files) {
			await deleteThumbnails(file.name);
		}

		if (deleteFromDB) {
			await prisma.files.deleteMany({
				where: {
					uuid: {
						in: files.map(file => file.uuid)
					}
				}
			});
		}
	} catch (error) {
		log.error(`There was an error removing one/all of the files < [${files.map(file => file.name).join(', ')}] >`);
		log.error(error);
	}
};

export const deleteThumbnails = async (filename: string) => {
	const thumbName = getFileThumbnail(filename);
	if (thumbName) await removeThumbs(thumbName);
};

export const purgeUserFiles = async (userId: number) => {
	try {
		const files = await prisma.files.findMany({
			where: {
				userId
			},
			include: {
				quarantineFile: true
			}
		});

		await deleteFiles({ files });

		await prisma.files.deleteMany({
			where: {
				userId
			}
		});
	} catch (error) {
		log.error(error);
	}
};

export const purgePublicFiles = async () => {
	try {
		const files = await prisma.files.findMany({
			where: {
				userId: null
			},
			include: {
				quarantineFile: true
			}
		});

		await deleteFiles({ files });

		await prisma.files.deleteMany({
			where: {
				userId: null
			}
		});
	} catch (error) {
		log.error(error);
	}
};

export const purgeIpFiles = async (ip: string) => {
	try {
		const files = await prisma.files.findMany({
			where: {
				ip
			},
			include: {
				quarantineFile: true
			}
		});

		await deleteFiles({ files });

		await prisma.files.deleteMany({
			where: {
				ip
			}
		});
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

		zip.writeZip(fileURLToPath(new URL(`../../../../uploads/zips/${albumUuid}.zip`, import.meta.url)));
	} catch (error) {
		log.error(error);
	}
};

export const constructFilePublicLink = ({
	req,
	fileName,
	quarantine = false,
	isS3 = false,
	isWatched = false
}: {
	fileName: string;
	isS3?: boolean;
	isWatched?: boolean;
	quarantine?: boolean;
	req: FastifyRequest;
}) => {
	const host = SETTINGS.serveUploadsFrom ? SETTINGS.serveUploadsFrom : getHost(req);
	const data = {
		url: isS3
			? `${SETTINGS.S3PublicUrl || SETTINGS.S3Endpoint}${quarantine ? '/quarantine' : ''}/${fileName}`
			: `${host}${quarantine ? '/quarantine' : ''}${isWatched ? '/live' : ''}/${fileName}`,
		thumb: '',
		thumbSquare: '',
		preview: ''
	};

	const { thumb, preview } = getFileThumbnail(fileName) ?? {};
	if (thumb) {
		data.thumb = `${host}/thumbs/${thumb}`;
		data.thumbSquare = `${host}/thumbs/square/${thumb}`;
		if (preview) {
			data.preview = `${host}/thumbs/preview/${preview}`;
		}
	}

	return data;
};

export const checkFileHashOnDB = async (user: RequestUser | User | undefined, file: FileInProgress) => {
	const dbFile = await prisma.files.findFirst({
		where: {
			hash: file.hash,
			size: file.size,
			// Must be null for guest uploads,
			// to ensure guests uploads will only be matched against other guest uploads
			user: user
				? {
						id: user.id
					}
				: {}
		}
	});

	if (dbFile) {
		return {
			// TODO: If public uploads are enabled we probably should NOT return the IP
			// from which the file was uploaded
			file: dbFile,
			repeated: true
		};
	}

	return null;
};

export const checkFileNameOnDB = async (user: RequestUser | User | undefined, fileName: string) => {
	const dbFile = await prisma.files.findFirst({
		where: {
			name: fileName,
			isWatched: true,
			user: user
				? {
						id: user.id
					}
				: {}
		}
	});

	if (dbFile) {
		return {
			file: dbFile,
			repeated: true
		};
	}

	return null;
};

export const storeFileToDb = async (
	user: RequestUser | User | undefined,
	file: FileInProgress,
	albumId?: number | null
) => {
	const now = moment.utc().toDate();

	const data = {
		userId: user?.id ?? undefined!,
		uuid: uuidv4(),
		name: file.name,
		original: file.original,
		type: file.type,
		size: file.size,
		hash: file.hash,
		ip: file.ip,
		isS3: file.isS3,
		isWatched: file.isWatched,
		createdAt: now,
		editedAt: now
	};

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

export const updateFileOnDb = async (user: RequestUser | User | undefined, file: FileInProgress & { uuid: string }) => {
	const now = moment.utc().toDate();

	const data = {
		userId: user?.id ?? undefined!,
		name: file.name,
		original: file.original,
		type: file.type,
		size: file.size,
		hash: file.hash,
		ip: file.ip,
		isS3: file.isS3,
		isWatched: file.isWatched,
		createdAt: now,
		editedAt: now
	};

	return prisma.files.update({
		where: { uuid: file.uuid, isWatched: true },
		data
	});
};

export const saveFileToAlbum = async (albumId: number, fileId: number) => {
	const now = moment.utc().toDate();
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

export const hashFile = async (uploadPath: string): Promise<string> => {
	const hasher = new Blake3Hasher();
	const stream = jetpack.createReadStream(uploadPath);
	return new Promise((resolve, reject) => {
		stream.on('data', data => {
			hasher.update(data);
		});

		stream.on('end', () => {
			resolve(hasher.digest('hex'));
			hasher.reset();
		});

		stream.on('error', error => {
			reject(error);
			hasher.reset();
		});
	});
};

export const handleUploadFile = async ({
	user,
	ip,
	upload,
	album
}: {
	album?: number | null | undefined;
	ip: string;
	upload: { name: string; path: string; size: string; type: string };
	user?: RequestUser | User | undefined;
}) => {
	// Assign a unique identifier to the file
	const uniqueIdentifier = await getUniqueFileIdentifier();
	if (!uniqueIdentifier) throw new Error('Could not generate unique identifier.');
	const newFileName = String(uniqueIdentifier) + extname(upload.name);
	log.debug(`> Name for upload: ${newFileName}`);

	// Move file to permanent location
	const newPath = fileURLToPath(new URL(`../../../../uploads/${newFileName}`, import.meta.url));
	const file = {
		name: newFileName,
		extension: extname(upload.name),
		path: newPath,
		original: upload.name,
		type: upload.type,
		size: upload.size,
		hash: await hashFile(upload.path),
		ip,
		isS3: false,
		isWatched: false
	};

	let uploadedFile;
	const fileOnDb = await checkFileHashOnDB(user, file);
	if (fileOnDb?.repeated) {
		uploadedFile = fileOnDb.file;
		await deleteTmpFile(upload.path);
	} else {
		await jetpack.moveAsync(upload.path, newPath);
		// Store file in database
		const savedFile = await storeFileToDb(user ? user : undefined, file, album ? album : undefined);

		uploadedFile = savedFile.file;

		// Generate thumbnails
		void generateThumbnails({ filename: savedFile.file.name });
	}

	return uploadedFile;
};
