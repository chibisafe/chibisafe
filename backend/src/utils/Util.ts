import type { Request } from 'hyper-express';
import type { Settings } from '../structures/interfaces';
import process from 'node:process';
import randomstring from 'randomstring';
import log from './Log';
import prisma from '../structures/database';
export { v4 as uuid } from 'uuid';

const parseEnvVariable = (value: boolean | number | string | undefined): boolean | number | string | undefined => {
	if (!value) return undefined;
	if (typeof value === 'boolean') return value;
	if (typeof value === 'number') return value;
	if (typeof value === 'string' && value.toLowerCase() === 'true') return true;
	if (typeof value === 'string' && value.toLowerCase() === 'false') return false;
	if (typeof value === 'string' && !Number.isNaN(Number(value))) return Number.parseInt(value, 10);
	return value;
};

// eslint-disable-next-line @typescript-eslint/consistent-type-assertions
export const getEnvironmentDefaults = () =>
	({
		port: parseEnvVariable(process.env.PORT) ?? 8000,
		domain: process.env.DOMAIN ?? 'localhost:8000',
		routePrefix: '/api',
		rateLimitWindow: parseEnvVariable(process.env.RATE_LIMIT_WINDOW) ?? 2,
		rateLimitMax: parseEnvVariable(process.env.RATE_LIMIT_MAX) ?? 5,
		secret: process.env.SECRET ?? randomstring.generate(64),
		serviceName: process.env.SERVICE_NAME ?? 'change-me',
		chunkSize: parseEnvVariable(process.env.CHUNK_SIZE) ?? 90,
		chunkedUploadsTimeout: parseEnvVariable(process.env.CHUNKED_UPLOADS_TIMEOUT) ?? 30 * 60 * 1000, // 30 minutes
		maxSize: parseEnvVariable(process.env.MAX_SIZE) ?? 5000,
		generateZips: parseEnvVariable(process.env.GENERATE_ZIPS) ?? true,
		generatedFilenameLength: parseEnvVariable(process.env.GENERATED_FILENAME_LENGTH) ?? 12,
		generatedAlbumLength: parseEnvVariable(process.env.GENERATED_ALBUM_LENGTH) ?? 6,
		blockedExtensions: process.env.BLOCKED_EXTENSIONS
			? process.env.BLOCKED_EXTENSIONS.split(',')
			: ['.jar', '.exe', '.msi', '.com', '.bat', '.cmd', '.scr', '.ps1', '.sh'],
		blockNoExtension: parseEnvVariable(process.env.BLOCK_NO_EXTENSION) ?? true,
		publicMode: parseEnvVariable(process.env.PUBLIC_MODE) ?? true,
		userAccounts: parseEnvVariable(process.env.USER_ACCOUNTS) ?? true,
		metaDescription: process.env.META_DESCRIPTION ?? 'Blazing fast file uploader and bunker written in node! 🚀',
		metaKeywords:
			process.env.META_KEYWORDS ?? 'chibisafe,lolisafe,upload,uploader,file,vue,images,ssr,file uploader,free',
		metaTwitterHandle: process.env.META_TWITTER_HANDLE ?? '@your-handle',
		backgroundImageURL: process.env.BACKGROUND_IMAGE_URL ?? '',
		logoURL: process.env.LOGO_URL ?? '',
		statisticsCron: process.env.STATISTICS_CRON ?? '0 0 * * * *',
		// eslint-disable-next-line eqeqeq
		disableStatisticsCron: parseEnvVariable(process.env.DISABLE_STATISTICS_CRON) ?? false,
		enabledStatistics: process.env.ENABLED_STATISTICS
			? process.env.ENABLED_STATISTICS.split(',')
			: ['system', 'service', 'fileSystems', 'uploads', 'users', 'albums']
		/* // NOTE: Unused as we currently are not storing statistics to database
		savedStatistics: process.env.SAVED_STATISTICS
			? process.env.SAVED_STATISTICS.split(',')
			: ['uploads', 'users', 'albums']
		*/
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
			length: getEnvironmentDefaults().generatedAlbumLength,
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
