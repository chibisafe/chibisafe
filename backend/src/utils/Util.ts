import type { Request } from 'hyper-express';
import type { Settings } from '../structures/interfaces';
import process from 'node:process';
import randomstring from 'randomstring';
import log from './Log';
import prisma from '../structures/database';
export { v4 as uuid } from 'uuid';
export const statsLastSavedTime = null;
export const _config = null;

/*
	TODO: Ask crawl how to properly type this.
	I want that if I call getConfig() to know the properties that will come back and their types
	to use them in nuxt.ts for example
*/
export const getConfig = async () => {
	const config = await prisma.settings.findMany();
	return config.reduce<Record<string, any>>((conf, item) => {
		if (typeof item.value === 'string') {
			conf[item.key] = JSON.parse(item.value);
		} else {
			conf[item.key] = item.value;
		}

		return config;
	}, {}) as Settings;
};

// eslint-disable-next-line @typescript-eslint/consistent-type-assertions
export const getEnvironmentDefaults = () =>
	({
		domain: process.env.DOMAIN ?? 'localhost:8000',
		routePrefix: '/api',
		rateLimitWindow: process.env.RATE_LIMIT_WINDOW ?? 2,
		rateLimitMax: process.env.RATE_LIMIT_MAX ?? 5,
		secret: process.env.SECRET ?? randomstring.generate(64),
		serviceName: process.env.SERVICE_NAME ?? 'change-me',
		chunkSize: process.env.CHUNK_SIZE ? Number.parseFloat(process.env.CHUNK_SIZE) : 90,
		chunkedUploadsTimeout: process.env.CHUNKED_UPLOADS_TIMEOUT
			? Number.parseInt(process.env.CHUNKED_UPLOADS_TIMEOUT, 10)
			: 30 * 60 * 1000, // 30 minutes
		maxSize: process.env.MAX_SIZE ? Number.parseFloat(process.env.MAX_SIZE) : 5000,
		// eslint-disable-next-line eqeqeq
		generateZips: process.env.GENERATE_ZIPS == undefined,
		generatedFilenameLength: process.env.GENERATED_FILENAME_LENGTH
			? Number.parseInt(process.env.GENERATED_FILENAME_LENGTH, 10)
			: 12,
		generatedAlbumLength: process.env.GENERATED_ALBUM_LENGTH ?? 6,
		blockedExtensions: process.env.BLOCKED_EXTENSIONS
			? process.env.BLOCKED_EXTENSIONS.split(',')
			: ['.jar', '.exe', '.msi', '.com', '.bat', '.cmd', '.scr', '.ps1', '.sh'],
		// eslint-disable-next-line eqeqeq
		blockNoExtension: process.env.BLOCK_NO_EXTENSION != undefined,
		// eslint-disable-next-line eqeqeq
		publicMode: process.env.PUBLIC_MODE == undefined,
		// eslint-disable-next-line eqeqeq
		userAccounts: process.env.USER_ACCOUNTS == undefined,
		metaThemeColor: process.env.META_THEME_COLOR ?? '#20222b',
		metaDescription: process.env.META_DESCRIPTION ?? 'Blazing fast file uploader and bunker written in node! 🚀',
		metaKeywords:
			process.env.META_KEYWORDS ?? 'chibisafe,lolisafe,upload,uploader,file,vue,images,ssr,file uploader,free',
		metaTwitterHandle: process.env.META_TWITTER_HANDLE ?? '@your-handle',
		backgroundImageURL: process.env.BACKGROUND_IMAGE_URL ?? '',
		logoURL: process.env.LOGO_URL ?? '',
		statisticsCron: process.env.STATISTICS_CRON ?? '0 0 * * * *',
		enabledStatistics: process.env.ENABLED_STATISTICS
			? process.env.ENABLED_STATISTICS.split(',')
			: ['system', 'fileSystems', 'uploads', 'users', 'albums'],
		savedStatistics: process.env.SAVED_STATISTICS
			? process.env.SAVED_STATISTICS.split(',')
			: ['system', 'fileSystems', 'uploads', 'users', 'albums']
	} as Settings);

export const wipeConfigDb = async () => {
	try {
		await prisma.settings.deleteMany();
	} catch (error) {
		console.error(error);
	}
};

export const writeConfigToDb = async (config: { key: string; value: string[] | boolean | number | string }) => {
	if (!config.key) return;
	try {
		const data = {
			key: config.key,
			value: JSON.stringify(config.value)
		};
		await prisma.settings.create({
			data
		});
	} catch (error) {
		console.error(error);
	}
};

export const getHost = (req: Request) => `${req.protocol}://${req.headers.host}`;

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

// A function that adds spaces to the beginning of the string until there are 7 characters
export const addSpaces = (str: string) => {
	const spaces = 7 - str.length;
	let newStr = '';
	for (let i = 0; i < spaces; i++) {
		newStr += ' ';
	}

	newStr += str;
	return newStr;
};

export const unlistenEmitters = (emitters: any[], eventName: string, listener?: (reason?: any) => void) => {
	if (!listener) return;
	for (const emitter of emitters) {
		if (!emitter) continue;
		emitter.off(eventName, listener);
	}
};
