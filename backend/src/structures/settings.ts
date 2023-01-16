/* eslint-disable require-atomic-updates */

import type { Settings } from '../structures/interfaces';
import randomstring from 'randomstring';
import log from '../utils/Log';
import prisma from './database';
import process from 'node:process';

export const SETTINGS = {} as Settings;

export const loadSettings = async () => {
	log.debug('Loading settings...');
	// if SETTINGS is not empty, return it
	if (Object.keys(SETTINGS).length > 0) return SETTINGS;

	// if SETTINGS is empty, get it from the database
	const settingsTable = await prisma.settings.findFirst();
	if (settingsTable) {
		log.debug('Settings already exist in database, skipping creation...');

		// These settings should be set from the environment variables
		SETTINGS.port = Number.isNaN(Number(process.env.PORT)) ? 8000 : Number(process.env.PORT) ?? 8000;

		// These are static for now
		SETTINGS.statisticsCron = '0 0 * * * *';
		SETTINGS.enabledStatistics = ['system', 'service', 'fileSystems', 'uploads', 'users', 'albums'];

		// These settings should be set from the database
		SETTINGS.domain = settingsTable.domain;
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
		SETTINGS.metaDescription = settingsTable.metaDescription;
		SETTINGS.metaKeywords = settingsTable.metaKeywords;
		SETTINGS.metaTwitterHandle = settingsTable.metaTwitterHandle;
		return;
	}

	// if SETTINGS is empty and there is no database entry, create it
	log.debug("Settings don't exist in database, creating...");
	const data = {
		domain: 'localhost:8000',
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
		logoURL: '',
		metaDescription: 'description for please-change-me.com 🚀',
		metaKeywords: 'comma, separated, keywords, that, describe, this, website',
		metaTwitterHandle: '@your-twitter-handle'
	};

	await prisma.settings.create({
		data
	});

	log.debug('Settings created, loading...');

	await loadSettings();
};
