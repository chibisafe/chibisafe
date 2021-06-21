require('dotenv').config();

const Joi = require('joi');
const { env } = process;

const StatsGenerator = require('../utils/StatsGenerator');

const Sections = Object.freeze({
	SERVICE: 'Service',
	FILE: 'File',
	USERS: 'Users',
	SOCIAL_AND_SHARING: 'Social and sharing',
	INSTANCE: 'Instance',
	STATISTICS: 'Statistics',
	SERVER: 'Server',
	OTHER: 'Other'
});

// use label to name them nicely
// use meta to set custom rendering (render as radio instead of dropdown for example) and custom order
// use description to add comments which will show up as a note somewhere next to the option
const schema = Joi.object({
	// Service settings
	serviceName: Joi.string().default('change-me')
		// .meta({ section })
		.meta({
			section: Sections.SERVICE
		})
		.label('Service name')
		.description('Name of the service'),

	secret: Joi.string().default(``)
		.meta({
			section: Sections.SERVICE
		})
		.label('Secret')
		.description('64 char secret key to sign JWT sessions')
		.note('If this setting is changed then every user session will be invalidates and every user will need to log in again.'),

	// File related settings
	chunkSize: Joi.number().integer().greater(0)
		.default(90)
		.meta({
			section: Sections.FILE
		})
		.label('Chunk size')
		.description('Maximum size of a chunk (files bigger than this limit will be split into multiple chunks)'),

	maxSize: Joi.number().integer().min(0) // setting it to 0 disabled the limit
		.default(5000)
		.meta({
			section: Sections.FILE
		})
		.label('Maximum file size')
		.description('Maximum allowed upload file size in MB (0 to disable)'),

	generateZips: Joi.boolean().default(true)
		.meta({
			section: Sections.FILE
		})
		.label('Generate zips')
		.description('Allows users to download entire albums in ZIP format'),

	generatedFilenameLength: Joi.number().integer().min(6)
		.default(12)
		.meta({
			section: Sections.FILE
		})
		.label('Generated file name length')
		.description('How long should the automatically generated file name be'),

	generatedAlbumLength: Joi.number().integer().min(4)
		.default(6)
		.meta({
			section: Sections.FILE
		})
		.label('Generated album name length')
		.description('How long should the automatically generated album identifier be'),

	blockedExtensions: Joi.array()
		.items(Joi.string().pattern(/^(\.\w+)+$/, { name: 'file extension' }))
		.default(['.jar', '.exe', '.msi', '.com', '.bat', '.cmd', '.scr', '.ps1', '.sh'])
		.meta({
			section: Sections.FILE
		})
		.label('Blocked extensions')
		.description('List of extensions which will be rejected by the server'),

	// User settings
	publicMode: Joi.boolean().default(true)
		.meta({
			section: Sections.USERS
		})
		.label('Public mode')
		.description('Allows people to upload files without an account'),

	userAccounts: Joi.boolean().default(true)
		.meta({
			section: Sections.USERS
		})
		.label('User creation')
		.description('Allows people to create new accounts'),

	// Social and sharing
	metaThemeColor: Joi.string().pattern(/^#([0-9a-f]{6}|[0-9a-f]{3})$/i).min(4)
		.max(7)
		.default('#20222b')
		.meta({
			section: Sections.SOCIAL_AND_SHARING
		})
		.label('Meta theme color')
		.description('Color that user agents should use to customize the display of the page/embeds'),

	metaDescription: Joi.string().default('Blazing fast file uploader and bunker written in node! 🚀')
		.meta({
			section: Sections.SOCIAL_AND_SHARING
		})
		.label('Meta description')
		.description('Short and accurate summary of the content of the page'),

	metaKeywords: Joi.string().default('chibisafe,lolisafe,upload,uploader,file,vue,images,ssr,file uploader,free')
		.meta({
			section: Sections.SOCIAL_AND_SHARING
		})
		.label('Meta keywords')
		.description('Words relevant to the page\'s content separated by commas'),

	metaTwitterHandle: Joi.string().pattern(/^@\w{1,15}$/, { name: 'twitter handle' })
		.meta({
			section: Sections.SOCIAL_AND_SHARING
		})
		.label('Twitter handle')
		.description('Your twitter username'),

	// Instance settings
	backgroundImageURL: Joi.string().uri().default(p => `${p.domain}/assets/images/background.jpg`)
		.meta({
			section: Sections.INSTANCE
		})
		.label('Background image link')
		.description('Background image that should be used instead of the default background'),

	logoURL: Joi.string().uri().default(p => `${p.domain}/assets/images/logo.jpg`)
		.meta({
			section: Sections.INSTANCE
		})
		.label('Logo image link')
		.description('Logo image that should be used instead of the default logo'),

	// Statistics settings
	// TODO: Pattern fails for patterns like 0 1,2-7 * * * * because of the mixing of lists and ranges
	statisticsCron: Joi.string().pattern(/((((\d+,)+\d+|([\d\*]+(\/|-)\d+)|\d+|\*) ?){6})/, { name: 'cron' }).default('0 0 * * * *')
		.meta({
			section: Sections.STATISTICS
		})
		.label('Statistics schedule')
		.description('Crontab like formated value which will be used to schedule generating and saving stats to the database'),

	enabledStatistics: Joi.array().items(Joi.string().valid(...Object.keys(StatsGenerator.statGenerators)).optional())
		.meta({ section: Sections.STATISTICS, displayType: 'checkbox' })
		.label('Enabled statistics')
		.description('Which statistics should be shown when opening the statistics page'),

	savedStatistics: Joi.array().items(Joi.string().valid(...Object.keys(StatsGenerator.statGenerators)).optional())
		.meta({ section: Sections.STATISTICS, displayType: 'checkbox' })
		.label('Cached statistics')
		.description('Which statistics should be saved to the database (refer to Statistics schedule for scheduling).')
		.note('If a statistics is enabled but not set to be saved, it will be generated every time the statistics page is opened'),

	// Server related settings
	rateLimitWindow: Joi.number().integer().default(2)
		.meta({ section: Sections.SERVER })
		.label('API rate limit window')
		.description('Timeframe for which requests are checked/remembered'),

	rateLimitMax: Joi.number().integer().default(5)
		.meta({ section: Sections.SERVER })
		.label('API maximum limit')
		.description('Max number of connections during windowMs milliseconds before sending a 429 response')
});

module.exports.schema = schema;
module.exports.configSchema = schema.describe();
