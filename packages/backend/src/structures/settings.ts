/* eslint-disable require-atomic-updates */

import process from 'node:process';
import randomstring from 'randomstring';
import type { Settings } from '~/structures/interfaces.js';
import { log } from '~/utils/Logger.js';
import prisma from './database.js';

export const SETTINGS = {} as Settings;
export const getSettingsMeta = (key: string) => {
	if (key in SETTINGS_META) {
		// @ts-ignore
		return SETTINGS_META[key];
	}
};

// @ts-ignore
export const loadSettings = async (force = false) => {
	log.debug('Loading settings...');
	// if SETTINGS is not empty, return it
	if (Object.keys(SETTINGS).length > 0 && !force) return SETTINGS;

	// if SETTINGS is empty, get it from the database
	const settingsTable = await prisma.settings.findFirst();
	if (settingsTable) {
		log.debug('Settings already exist in database, skipping creation...');

		// These settings should be set from the environment variables
		SETTINGS.port = Number.isNaN(Number(process.env.PORT)) ? 8000 : Number(process.env.PORT) ?? 8000;
		SETTINGS.host = process.env.HOST ?? 'localhost';

		// These are static for now
		SETTINGS.statisticsCron = '0 0 * * * *';
		SETTINGS.enabledStatistics = ['system', 'service', 'fileSystems', 'uploads', 'users', 'albums'];

		// Run the update check at midnight every day
		SETTINGS.updateCheckCron = '0 * * * *';

		// These settings should be set from the database
		SETTINGS.serviceName = settingsTable.serviceName;
		SETTINGS.serveUploadsFrom = settingsTable.serveUploadsFrom || '';
		SETTINGS.rateLimitWindow = settingsTable.rateLimitWindow;
		SETTINGS.rateLimitMax = settingsTable.rateLimitMax;
		SETTINGS.secret = settingsTable.secret;
		SETTINGS.chunkSize = Number(settingsTable.chunkSize);
		SETTINGS.chunkedUploadsTimeout = settingsTable.chunkedUploadsTimeout;
		SETTINGS.maxSize = Number(settingsTable.maxSize);
		SETTINGS.generateZips = settingsTable.generateZips;
		SETTINGS.generateOriginalFileNameWithIdentifier = settingsTable.generateOriginalFileNameWithIdentifier;
		SETTINGS.enableMixedCaseFilenames = settingsTable.enableMixedCaseFilenames;
		SETTINGS.generatedFilenameLength = settingsTable.generatedFilenameLength;
		SETTINGS.generatedAlbumLength = settingsTable.generatedAlbumLength;
		SETTINGS.generatedLinksLength = settingsTable.generatedLinksLength;
		SETTINGS.blockedExtensions = settingsTable.blockedExtensions.split(',');
		SETTINGS.blockNoExtension = settingsTable.blockNoExtension;
		SETTINGS.publicMode = settingsTable.publicMode;
		SETTINGS.userAccounts = settingsTable.userAccounts;
		SETTINGS.disableStatisticsCron = settingsTable.disableStatisticsCron;
		SETTINGS.disableUpdateCheck = settingsTable.disableUpdateCheck;
		SETTINGS.backgroundImageURL = settingsTable.backgroundImageURL;
		SETTINGS.logoURL = settingsTable.logoURL;
		SETTINGS.metaDescription = settingsTable.metaDescription;
		SETTINGS.metaKeywords = settingsTable.metaKeywords;
		SETTINGS.metaTwitterHandle = settingsTable.metaTwitterHandle;
		SETTINGS.metaDomain = settingsTable.metaDomain;
		SETTINGS.usersStorageQuota = Number(settingsTable.usersStorageQuota);
		SETTINGS.useNetworkStorage = settingsTable.useNetworkStorage;
		SETTINGS.useMinimalHomepage = settingsTable.useMinimalHomepage;
		SETTINGS.useUrlShortener = settingsTable.useUrlShortener;
		SETTINGS.generateThumbnails = settingsTable.generateThumbnails;
		SETTINGS.S3Region = settingsTable.S3Region;
		SETTINGS.S3Bucket = settingsTable.S3Bucket;
		SETTINGS.S3AccessKey = settingsTable.S3AccessKey;
		SETTINGS.S3SecretKey = settingsTable.S3SecretKey;
		SETTINGS.S3Endpoint = settingsTable.S3Endpoint;
		SETTINGS.S3PublicUrl = settingsTable.S3PublicUrl;
		SETTINGS.privacyPolicyPageContent = settingsTable.privacyPolicyPageContent;
		SETTINGS.termsOfServicePageContent = settingsTable.termsOfServicePageContent;
		SETTINGS.rulesPageContent = settingsTable.rulesPageContent;
		return;
	}

	// if SETTINGS is empty and there is no database entry, create it
	log.debug("Settings don't exist in database, creating...");
	const data = {
		rateLimitWindow: 1000,
		rateLimitMax: 100,
		secret: randomstring.generate(64),
		serviceName: 'change-me',
		serveUploadsFrom: '',
		chunkSize: 9 * 9e6, // 90 MB
		chunkedUploadsTimeout: 30 * 60 * 1000, // 30 minutes
		maxSize: 1 * 1e9, // 1 GB
		generateZips: true,
		generateOriginalFileNameWithIdentifier: false,
		enableMixedCaseFilenames: true,
		generatedFilenameLength: 12,
		generatedAlbumLength: 6,
		generatedLinksLength: 8,
		blockedExtensions: ['.jar', '.exe', '.msi', '.com', '.bat', '.cmd', '.scr', '.ps1', '.sh'].join(','),
		blockNoExtension: true,
		publicMode: false,
		userAccounts: false,
		disableStatisticsCron: false,
		disableUpdateCheck: false,
		backgroundImageURL: '',
		logoURL: '',
		metaDomain: 'https://your-domain.com',
		metaDescription: 'description for please-change-me.com 🚀',
		metaKeywords: 'comma, separated, keywords, that, describe, this, website',
		metaTwitterHandle: '@your-twitter-handle',
		usersStorageQuota: 0,
		useNetworkStorage: false,
		useMinimalHomepage: false,
		useUrlShortener: false,
		generateThumbnails: true,
		S3Region: '',
		S3Bucket: '',
		S3AccessKey: '',
		S3SecretKey: '',
		S3Endpoint: '',
		S3PublicUrl: '',
		privacyPolicyPageContent: '',
		termsOfServicePageContent: '',
		rulesPageContent: ''
	};

	await prisma.settings.create({
		data: {
			...data,
			// This is due to prisma not supporting int64
			maxSize: String(data.maxSize),
			chunkSize: String(data.chunkSize),
			usersStorageQuota: String(data.usersStorageQuota)
		}
	});

	log.debug('Settings created, loading...');

	await loadSettings();
};

const SETTINGS_META = {
	port: {
		type: 'number',
		description: 'The port the server will listen on.',
		name: 'Port',
		category: 'service'
	},
	host: {
		type: 'string',
		description: 'The host the server will listen on.',
		name: 'Host',
		category: 'service'
	},
	serveUploadsFrom: {
		type: 'string',
		description:
			'If using Docker, make sure to change this setting to reflect the domain name you are hosting chibisafe on.',
		name: 'Serve Uploads From',
		notice: 'Make sure to use a full domain name, including https:// . (for example: https://cdn.chibisafe.app)',
		category: 'service'
	},
	rateLimitWindow: {
		type: 'number',
		description: 'The window in milliseconds for rate limiting.',
		name: 'Rate Limit Window',
		notice: 'For this setting to take effect, you need to restart the server.',
		example: '1000',
		category: 'service'
	},
	rateLimitMax: {
		type: 'number',
		description: 'The maximum amount of requests per window for rate limiting.',
		name: 'Rate Limit Max',
		notice: 'For this setting to take effect, you need to restart the server.',
		example: '100',
		category: 'service'
	},
	secret: {
		type: 'string',
		description: 'A secret string used for signing JWT tokens. Keep this secret!',
		name: 'Secret',
		notice: 'Changing this will log out everyone. Make sure this setting is random and at least 64 characters long.',
		category: 'service'
	},
	serviceName: {
		type: 'string',
		description: 'The name of the service.',
		name: 'Service Name',
		example: 'chibisafe',
		category: 'customization'
	},
	chunkSize: {
		type: 'number',
		description:
			'The size of each chunk in bytes. This setting is useful if you want to upload big files, splitting them into smaller chunks.',
		name: 'Chunk Size',
		example: '9000000',
		category: 'uploads'
	},
	chunkedUploadsTimeout: {
		type: 'number',
		description: 'The timeout in milliseconds for chunked uploads.',
		name: 'Chunked Uploads Timeout',
		category: 'uploads'
	},
	maxSize: {
		type: 'number',
		description: 'The maximum size of an upload in bytes.',
		name: 'Max Size',
		example: '1000000000',
		category: 'uploads'
	},
	generateZips: {
		type: 'boolean',
		description: 'Whether or not to allow users to generate zips from public albums.',
		name: 'Generate Zips',
		category: 'other'
	},
	generateOriginalFileNameWithIdentifier: {
		type: 'boolean',
		description: 'Whether to generate filenames with the original filename and identifer as a suffix.',
		name: 'Enable Original Filename with Identifier',
		category: 'uploads'
	},
	enableMixedCaseFilenames: {
		type: 'boolean',
		description: 'Whether to allow mixed case filenames.',
		name: 'Enable Mixed Case Filenames',
		category: 'uploads'
	},
	generatedFilenameLength: {
		type: 'number',
		description: 'The length of the generated filenames.',
		name: 'Generated Filename Length',
		notice: 'This setting should at least be 8 characters long to avoid collisions.',
		category: 'uploads'
	},
	generatedAlbumLength: {
		type: 'number',
		description: 'The length of the generated album names.',
		name: 'Generated Album Length',
		notice: 'This setting should at least be 4 characters long to avoid collisions.',
		category: 'other'
	},
	generatedLinksLength: {
		type: 'number',
		description: 'The length of the generated short URL links.',
		name: 'Generated short URL Length',
		notice: 'This setting should at least be 8 characters long to avoid collisions.',
		category: 'other'
	},
	blockedExtensions: {
		type: 'string',
		description: 'The blocked extensions for uploads. Separate them with a comma.',
		name: 'Blocked Extensions',
		category: 'uploads',
		example: '.exe,.msi,.com,.bat,.cmd,.scr,.ps1,.sh'
	},
	blockNoExtension: {
		type: 'boolean',
		description: 'Whether or not to block uploads without an extension.',
		name: 'Block No Extension',
		category: 'uploads'
	},
	publicMode: {
		type: 'boolean',
		description: 'If public mode is enabled, users will be able to upload files without being logged in.',
		name: 'Public Mode',
		category: 'users'
	},
	userAccounts: {
		type: 'boolean',
		description:
			'If user accounts are disabled, users will not be able to register new accounts unless they have an invite.',
		name: 'User Accounts',
		category: 'users'
	},
	disableStatisticsCron: {
		type: 'boolean',
		description: 'Whether or not to disable the statistics cron.',
		name: 'Disable Statistics Cron',
		category: 'service'
	},
	disableUpdateCheck: {
		type: 'boolean',
		description: 'Whether or not to disable the update check.',
		name: 'Disable Update Check',
		category: 'service'
	},
	backgroundImageURL: {
		type: 'string',
		description: 'The URL for the background image of the instance.',
		name: 'Background Image URL',
		category: 'customization'
	},
	logoURL: {
		type: 'string',
		description: 'The URL for the logo.',
		name: 'Logo URL',
		category: 'customization'
	},
	metaDomain: {
		type: 'string',
		description: 'The meta domain used for the website SEO.',
		name: 'Meta Domain',
		example: 'https://my.chibisafe.instance.moe',
		category: 'customization'
	},
	metaDescription: {
		type: 'string',
		description: 'The meta description for the website SEO.',
		name: 'Meta Description',
		example: 'A simple and easy to use file hosting service.',
		category: 'customization'
	},
	metaKeywords: {
		type: 'string',
		description: 'The meta keywords for the website SEO.',
		name: 'Meta Keywords',
		example: 'file, hosting, service',
		category: 'customization'
	},
	metaTwitterHandle: {
		type: 'string',
		description: 'The twitter handle of the instance owner.',
		name: 'Meta Twitter Handle',
		example: '@your-instance-handle',
		category: 'customization'
	},
	usersStorageQuota: {
		type: 'number',
		description: 'The storage quota for each user in bytes. 0 for unlimited.',
		name: 'Users Storage Quota',
		notice: "You can override this setting by changing it on a user's profile.",
		category: 'users'
	},
	useUrlShortener: {
		type: 'boolean',
		description: 'Whether or not to use the built-in URL shortener.',
		name: 'Use URL Shortener',
		category: 'other'
	},
	useNetworkStorage: {
		type: 'boolean',
		description: 'Whether or not to use network storage like S3/Backblaze/Wasabi.',
		name: 'Use Network Storage',
		category: 'uploads'
	},
	generateThumbnails: {
		type: 'boolean',
		description: 'Whether or not to generate thumbnails for images and videos.',
		name: 'Generate Thumbnails',
		category: 'uploads'
	},
	S3Region: {
		type: 'string',
		description: 'The region for the S3 bucket.',
		name: 'S3 Region',
		category: 'uploads'
	},
	S3Bucket: {
		type: 'string',
		description: 'The name of the S3 bucket.',
		name: 'S3 Bucket',
		category: 'uploads'
	},
	S3AccessKey: {
		type: 'string',
		description: 'The accesss key for the S3 bucket.',
		name: 'S3 Access Key',
		category: 'uploads'
	},
	S3SecretKey: {
		type: 'string',
		description: 'The secret key for the S3 bucket.',
		name: 'S3 Secret Key',
		category: 'uploads'
	},
	S3Endpoint: {
		type: 'string',
		description: 'The endpoint for the S3 bucket. Leave empty for AWS S3.',
		name: 'S3 Endpoint',
		category: 'uploads'
	},
	S3PublicUrl: {
		type: 'string',
		description: 'The public URL for the S3 bucket. Needed for AWS S3, not sure for others.',
		name: 'S3 Public URL',
		example: 'https://chibisafe.s3.us-east-1.amazonaws.com',
		category: 'uploads'
	},
	useMinimalHomepage: {
		type: 'boolean',
		description: 'Whether or not to use a minimal version of the homepage.',
		name: 'Use Minimal Homepage',
		category: 'customization'
	},
	privacyPolicyPageContent: {
		type: 'text',
		description: 'The markdown content for the privacy policy page. Leave empty to disable.',
		name: 'Privacy Policy Page',
		category: 'legal'
	},
	termsOfServicePageContent: {
		type: 'text',
		description: 'The markdown content for the terms of service page. Leave empty to disable.',
		name: 'Terms of Service Page',
		category: 'legal'
	},
	rulesPageContent: {
		type: 'text',
		description: 'The markdown content for the rules page. Leave empty to disable.',
		name: 'Rules Page',
		category: 'legal'
	}
};
