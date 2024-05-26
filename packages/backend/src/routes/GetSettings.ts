import type { FastifyReply } from 'fastify';
import { z } from 'zod';
import type { RequestWithUser } from '@/structures/interfaces.js';
import { SETTINGS } from '@/structures/settings.js';

export const schema = {
	summary: 'Get settings',
	describe: 'Get the current settings of the instance',
	tags: ['Server'],
	response: {
		200: z.object({
			serviceName: z.string().describe('The name of the service.'),
			metaDescription: z.string().optional().describe('The description of the service.'),
			metaKeywords: z.array(z.string().optional().describe('The keywords of the service.')),
			metaTwitterHandle: z.string().optional().describe('The Twitter handle of the service.'),
			metaDomain: z.string().optional().describe('The domain of the service.'),
			chunkSize: z.number().describe('The size of each chunk in bytes.'),
			maxSize: z.number().describe('The maximum size of a file in bytes.'),
			logoURL: z.string().describe('The URL of the logo.'),
			backgroundImageURL: z.string().describe('The URL of the background image.'),
			publicMode: z.boolean().describe('Whether or not the service is in public mode.'),
			userAccounts: z.boolean().describe('Whether or not user accounts are enabled.'),
			blockedExtensions: z.array(z.string()).describe('The list of blocked extensions.'),
			useNetworkStorage: z.boolean().describe('Whether or not network storage is enabled.'),
			useMinimalHomepage: z
				.boolean()
				.optional()
				.describe('Whether or not to use a minimal version of the homepage.'),
			useUrlShortener: z.boolean().describe('Whether or not to use the URL shortener.'),
			serveUploadsFrom: z.string().optional().describe('The URL to serve uploads from.'),
			privacyPolicyPageContent: z
				.boolean()
				.optional()
				.describe('Whether or not the privacy policy page is enabled.'),
			termsOfServicePageContent: z
				.boolean()
				.optional()
				.describe('Whether or not the terms of service page is enabled.'),
			rulesPageContent: z.boolean().optional().describe('Whether or not the rules page is enabled.')
		})
	}
};

export const options = {
	url: '/settings',
	method: 'get'
};

export const run = (_: RequestWithUser, res: FastifyReply) => {
	return res.send({
		serviceName: SETTINGS.serviceName,
		metaDescription: SETTINGS.metaDescription,
		metaKeywords: SETTINGS.metaKeywords ? SETTINGS.metaKeywords.split(', ') : [],
		metaTwitterHandle: SETTINGS.metaTwitterHandle,
		metaDomain: SETTINGS.metaDomain,
		chunkSize: SETTINGS.chunkSize,
		maxSize: SETTINGS.maxSize,
		logoURL: SETTINGS.logoURL,
		backgroundImageURL: SETTINGS.backgroundImageURL,
		publicMode: SETTINGS.publicMode,
		userAccounts: SETTINGS.userAccounts,
		blockedExtensions: SETTINGS.blockedExtensions,
		useNetworkStorage: SETTINGS.useNetworkStorage,
		useMinimalHomepage: SETTINGS.useMinimalHomepage,
		serveUploadsFrom: SETTINGS.serveUploadsFrom,
		useUrlShortener: SETTINGS.useUrlShortener,
		privacyPolicyPageContent: Boolean(SETTINGS.privacyPolicyPageContent),
		termsOfServicePageContent: Boolean(SETTINGS.termsOfServicePageContent),
		rulesPageContent: Boolean(SETTINGS.rulesPageContent)
	});
};
