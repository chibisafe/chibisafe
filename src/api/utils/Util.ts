import jetpack from 'fs-jetpack';
import randomstring from 'randomstring';
import path from 'path';
import prisma from '../structures/database';
import { utc } from 'moment';
import Zip from 'adm-zip';
import { generateThumbnails, getFileThumbnail, removeThumbs } from './ThumbUtil';
import { getStats } from './StatsGenerator';
import type { FastifyRequest, FastifyReply } from 'fastify';
import type { File, ExtendedFile, ExtendedFileWithData, Album, User } from '../structures/interfaces';

// TODO: Check that importing the log function works for routes and CLI (generateThumbs.ts)
import { log } from '../main';

export { generateThumbnails } from './ThumbUtil';
export { v4 as uuid } from 'uuid';

const preserveExtensions = ['.tar.gz', '.tar.z', '.tar.bz2', '.tar.lzma', '.tar.lzo', '.tar.xz'];

export const uploadPath = path.join(__dirname, '../../../', 'uploads');
export const statsLastSavedTime = null;
export const _config = null;

export const getConfig = async () => {
	const config = await prisma.settings.findMany();
	return config.reduce((conf, item) => {
		if (typeof item.value === 'string') {
			conf[item.key] = JSON.parse(item.value);
		} else {
			conf[item.key] = item.value;
		}
		return config;
	}, {} as Record<string, any>);
};

export const getEnvironmentDefaults = () => ({
	domain: process.env.DOMAIN,
	routePrefix: '/api',
	rateLimitWindow: process.env.RATE_LIMIT_WINDOW ?? 2,
	rateLimitMax: process.env.RATE_LIMIT_MAX ?? 5,
	secret: process.env.SECRET ?? randomstring.generate(64),
	serviceName: process.env.SERVICE_NAME ?? 'change-me',
	chunkSize: process.env.CHUNK_SIZE ?? 90,
	maxSize: process.env.MAX_SIZE ?? 5000,
	// eslint-disable-next-line eqeqeq
	generateZips: process.env.GENERATE_ZIPS == undefined ? true : false,
	generatedFilenameLength: process.env.GENERATED_FILENAME_LENGTH ?? 12,
	generatedAlbumLength: process.env.GENERATED_ALBUM_LENGTH ?? 6,
	blockedExtensions: process.env.BLOCKED_EXTENSIONS ? process.env.BLOCKED_EXTENSIONS.split(',') : ['.jar', '.exe', '.msi', '.com', '.bat', '.cmd', '.scr', '.ps1', '.sh'],
	// eslint-disable-next-line eqeqeq
	publicMode: process.env.PUBLIC_MODE == undefined ? true : false,
	// eslint-disable-next-line eqeqeq
	userAccounts: process.env.USER_ACCOUNTS == undefined ? true : false,
	metaThemeColor: process.env.META_THEME_COLOR ?? '#20222b',
	metaDescription: process.env.META_DESCRIPTION ?? 'Blazing fast file uploader and bunker written in node! 🚀',
	metaKeywords: process.env.META_KEYWORDS ?? 'chibisafe,lolisafe,upload,uploader,file,vue,images,ssr,file uploader,free',
	metaTwitterHandle: process.env.META_TWITTER_HANDLE ?? '@your-handle',
	backgroundImageURL: process.env.BACKGROUND_IMAGE_URL ?? '',
	logoURL: process.env.LOGO_URL ?? '',
	statisticsCron: process.env.STATISTICS_CRON ?? '0 0 * * * *',
	enabledStatistics: process.env.ENABLED_STATISTICS ? process.env.ENABLED_STATISTICS.split(',') : ['system', 'fileSystems', 'uploads', 'users', 'albums'],
	savedStatistics: process.env.SAVED_STATISTICS ? process.env.SAVED_STATISTICS.split(',') : ['system', 'fileSystems', 'uploads', 'users', 'albums']
});

export const wipeConfigDb = async () => {
	try {
		await prisma.settings.deleteMany();
	} catch (error) {
		console.error(error);
	}
};

export const writeConfigToDb = async (config: { key: string; value: string }) => {
	if (!config.key) return;
	try {
		config.value = JSON.stringify(config.value);
		await prisma.settings.create({
			data: config
		});
	} catch (error) {
		console.error(error);
	}
};

export const isExtensionBlocked = async (extension: string) => (await getConfig()).blockedExtensions.includes(extension);
export const getMimeFromType = (fileTypeMimeObj: Record<string, null>) => fileTypeMimeObj.mime;

export const constructFilePublicLink = (req: FastifyRequest, file: File) => {
	/*
		TODO: This wont work without a reverse proxy serving both
		the site and the API under the same domain. Pls fix.
	*/
	const extended = file as ExtendedFile;
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

export const getUniqueFilename = (extension: string) => {
	const retry: any = async (i = 0) => {
		const filename = randomstring.generate({
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

export const getUniqueAlbumIdentifier = () => {
	const retry: any = async (i = 0) => {
		const identifier = randomstring.generate({
			length: (await getConfig()).generatedAlbumLength,
			capitalization: 'lowercase'
		});
		const exists = await prisma.links.findFirst({
			where: {
				identifier
			}
		});
		if (!exists) return identifier;
		/*
			It's funny but if you do i++ the asignment never gets done resulting in an infinite loop
		*/
		if (i < 5) return retry(i + 1);
		log.error('Couldnt allocate identifier for album');
		return null;
	};
	return retry();
};

export const getFilenameFromPath = (fullPath: string) => fullPath.replace(/^.*[\\\/]/, ''); // eslint-disable-line no-useless-escape

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

export const createZip = (files: string[], album: Album) => {
	try {
		const zip = new Zip();
		for (const file of files) {
			zip.addLocalFile(path.join(uploadPath, file));
		}
		zip.writeZip(
			path.join(__dirname, '../../../', 'uploads', 'zips', `${album.userId}-${album.id}.zip`)
		);
	} catch (error) {
		log.error(error);
	}
};

export const fileExists = (req: FastifyRequest, res: FastifyReply, exists: File, filename: string) => {
	const file = constructFilePublicLink(req, exists);
	void res.send({
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

export const storeFileToDb = async (req: FastifyRequest, res: FastifyReply, user: User, file: ExtendedFileWithData) => {
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

/*
// TODO: Allow choosing what to save to db and what stats we care about in general
// TODO: if a stat is not saved to db but selected to be shows on the dashboard, it will be generated during the request
export const saveStatsToDb = async (force: boolean) => {
	// If there were no changes since the instance started, don't generate new stats
	// OR
	// if we alredy saved a stats to the db, and there were no new changes to the db since then
	// skip generating and saving new stats.
	if (!force &&
		(!db.userParams.lastMutationTime ||
			(Util.statsLastSavedTime && Util.statsLastSavedTime > db.userParams.lastMutationTime)
		)
	) {
		return;
	}

	const now = utc().toDate();
	const stats = await getStats(db);

	let batchId = 1;

	const res = (await db('statistics').max({ lastBatch: 'batchId' }))[0];
	if (res && res.lastBatch) {
		batchId = res.lastBatch + 1;
	}

	try {
		for (const [type, data] of Object.entries(stats)) {
			await db.table('statistics').insert({ type, data: JSON.stringify(data), createdAt: now, batchId });
		}

		Util.statsLastSavedTime = now.getTime();
	} catch (error) {
		console.error(error);
	}
};
*/

export const getHost = (req: FastifyRequest) => `${req.protocol}://${req.headers.host as string}`;
