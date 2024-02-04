import path from 'node:path';
import process from 'node:process';
import { URL, fileURLToPath } from 'node:url';
import { DeleteObjectsCommand } from '@aws-sdk/client-s3';
import Zip from 'adm-zip';
import * as blake3 from 'blake3';
import type { FastifyRequest } from 'fastify';
import jetpack from 'fs-jetpack';
import moment from 'moment';
import randomstring from 'randomstring';
import { v4 as uuidv4 } from 'uuid';
import prisma from '@/structures/database.js';
import type { FileInProgress, RequestUser, User } from '@/structures/interfaces.js';
import { SETTINGS } from '@/structures/settings.js';
import { log } from '@/utils/Logger.js';
import { getFileThumbnail, removeThumbs } from './Thumbnails.js';
import { getHost } from './Util.js';

const fileIdentifierMaxTries = 5;

const preserveExtensions = [
	/\.tar\.\w+/i // tarballs
];
export const uploadPath = fileURLToPath(new URL('../../../../uploads', import.meta.url));
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
						file.quarantine ? quarantinePath : uploadPath,
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
	isS3 = false
}: {
	fileName: string;
	isS3?: boolean;
	quarantine?: boolean;
	req: FastifyRequest;
}) => {
	const host = SETTINGS.serveUploadsFrom ? SETTINGS.serveUploadsFrom : getHost(req);
	const data = {
		url: isS3
			? `${SETTINGS.S3PublicUrl || SETTINGS.S3Endpoint}${quarantine ? '/quarantine' : ''}/${fileName}`
			: `${host}${quarantine ? '/quarantine' : ''}/${fileName}`,
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
	const hash = blake3.createHash();
	const stream = jetpack.createReadStream(uploadPath);
	return new Promise((resolve, reject) => {
		stream.on('data', data => {
			hash.update(data);
		});

		stream.on('end', () => {
			resolve(hash.digest('hex'));
			hash.dispose();
		});

		stream.on('error', error => {
			reject(error);
			hash.dispose();
		});
	});
};
