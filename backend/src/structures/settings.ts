/* eslint-disable require-atomic-updates */

import type { Settings } from '../structures/interfaces';
import randomstring from 'randomstring';
import log from '../utils/Log';
import prisma from './database';
import process from 'node:process';

export const SETTINGS = {} as Settings;

const parseEnvVariable = (value: boolean | number | string | undefined): boolean | number | string | undefined => {
	if (!value) return undefined;
	if (typeof value === 'boolean') return value;
	if (typeof value === 'number') return value;
	if (typeof value === 'string' && value.toLowerCase() === 'true') return true;
	if (typeof value === 'string' && value.toLowerCase() === 'false') return false;
	if (typeof value === 'string' && !Number.isNaN(Number(value))) return Number.parseInt(value, 10);
	return value;
};

export const loadSettings = async () => {
	log.debug('Loading settings...');
	// if SETTINGS is not empty, return it
	if (Object.keys(SETTINGS).length > 0) return SETTINGS;

	// if SETTINGS is empty, get it from the database
	const settingsTable = await prisma.settings.findFirst();
	if (settingsTable) {
		log.debug('Settings already exist in database, skipping creation...');

		// These settings should be set from the environment variables
		SETTINGS.port = Number(process.env.PORT) ?? 8000;
		SETTINGS.domain = process.env.DOMAIN ?? 'localhost:8000';
		SETTINGS.statisticsCron = '0 0 * * * *';
		SETTINGS.enabledStatistics = ['system', 'service', 'fileSystems', 'uploads', 'users', 'albums'];

		// These settings should be set from the database
		SETTINGS.rateLimitWindow = settingsTable.rateLimitWindow;
		SETTINGS.rateLimitMax = settingsTable.rateLimitMax;
		SETTINGS.secret = settingsTable.secret;
		SETTINGS.serviceName = settingsTable.serviceName;
		SETTINGS.chunkSize = settingsTable.chunkSize;
		SETTINGS.chunkedUploadsTimeout = settingsTable.chunkedUploadsTimeout;
		SETTINGS.maxSize = settingsTable.maxSize;
		SETTINGS.generateZips = settingsTable.generateZips;
		SETTINGS.generatedFilenameLength = settingsTable.generatedFilenameLength;
		SETTINGS.generatedAlbumLength = settingsTable.generatedAlbumLength;
		SETTINGS.blockedExtensions = JSON.parse(settingsTable.blockedExtensions);
		SETTINGS.blockNoExtension = settingsTable.blockNoExtension;
		SETTINGS.publicMode = settingsTable.publicMode;
		SETTINGS.userAccounts = settingsTable.userAccounts;
		SETTINGS.disableStatisticsCron = settingsTable.disableStatisticsCron;
		SETTINGS.backgroundImageURL = settingsTable.backgroundImageURL;
		SETTINGS.logoURL = settingsTable.logoURL;
		return;
	}

	// if SETTINGS is empty and there is no database entry, create it
	log.debug("Settings don't exist in database, creating...");
	const data = {
		rateLimitWindow: 2,
		rateLimitMax: 5,
		secret: randomstring.generate(64),
		serviceName: 'change-me',
		chunkSize: 90, // 90MB
		chunkedUploadsTimeout: 30 * 60 * 1000, // 30 minutes
		maxSize: 5 * 1000, // 5MN
		generateZips: true,
		generatedFilenameLength: 12,
		generatedAlbumLength: 6,
		blockedExtensions: JSON.stringify(['.jar', '.exe', '.msi', '.com', '.bat', '.cmd', '.scr', '.ps1', '.sh']),
		blockNoExtension: true,
		publicMode: true,
		userAccounts: true,
		disableStatisticsCron: false,
		backgroundImageURL: '',
		logoURL: ''
	};

	await prisma.settings.create({
		data
	});

	log.debug('Settings created, loading...');

	await loadSettings();
};
