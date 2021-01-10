require('dotenv').config();

const Joi = require('joi');
const { env } = process;

const StatsGenerator = require('../utils/StatsGenerator');

// use label to name them nicely
// use meta to set custom rendering (render as radio instead of dropdown for example) and custom order
// use description to add comments which will show up as a note somewhere next to the option
const schema = Joi.object({
	// Service settings
	serviceName: Joi.string().default('change-me')
		.label('Service name')
		.description('Name of the service'),

	domain: Joi.string().default(`http://localhost:${env.SERVER_PORT}`)
		.label('Domain')
		.description('Full domain this instance is gonna be running on'),

	// File related settings
	chunkSize: Joi.number().integer().greater(0)
		.default(90)
		.label('Chunk size')
		.description('Maximum size of a chunk (files bigger than this limit will be split into multiple chunks)'),

	maxSize: Joi.number().integer().min(0) // setting it to 0 disabled the limit
		.default(5000)
		.label('Maximum file size')
		.description('Maximum allowed upload file size in MB (0 to disable)'),

	generateZips: Joi.boolean().default(true)
		.label('Generate zips')
		.description('Allows users to download entire albums in ZIP format'),

	generatedFileNameLength: Joi.number().integer().min(6)
		.default(12)
		.label('Generated file name length')
		.description('How long should the automatically generated file name be'),

	generatedAlbumLength: Joi.number().integer().min(6)
		.default(6)
		.label('Generated album name length')
		.description('How long should the automatically generated album identifier be'),

	maxLinksPerAlbum: Joi.number().integer().greater(0)
		.default(5)
		.label('Maximum album links')
		.description('Maximum allowed number of a distinct links for an album'),

	uploadsFolder: Joi.string().default('uploads')
		.label('Uploads folder')
		.description('Name of the folder where the uploads will be stored'),

	blockedExtensions: Joi.array()
		.items(Joi.string().pattern(/^(\.\w+)+$/, { name: 'file extension' }))
		.default(['.jar', '.exe', '.msi', '.com', '.bat', '.cmd', '.scr', '.ps1', '.sh'])
		.label('Blocked extensions')
		.description('List of extensions which will be rejected by the server'),

	// User settings
	publicMode: Joi.boolean().default(true)
		.label('Public mode')
		.description('Allows people to upload files without an account'),

	userAccount: Joi.boolean().default(true)
		.label('User creation')
		.description('Allows people to create new accounts'),

	// Social and sharing
	metaThemeColor: Joi.string().hex().min(3)
		.max(6)
		.default('20222b')
		.label('Meta theme color')
		.description('Color that user agents should use to customize the display of the page/embeds'),

	metaDescription: Joi.string().default('Blazing fast file uploader and bunker written in node! 🚀')
		.label('Meta description')
		.description('Short and accurate summary of the content of the page'),

	metaKeyword: Joi.string().default('chibisafe,lolisafe,upload,uploader,file,vue,images,ssr,file uploader,free')
		.label('Meta keywords')
		.description('Words relevant to the page\'s content separated by commas'),

	metaTwitterHandle: Joi.string().pattern(/^@\w{1,15}$/, { name: 'twitter handle' })
		.label('Twitter handle')
		.description('Your twitter handle'),

	// Instance settings
	backgroundImageURL: Joi.string().uri().default(p => `${p.domain}/assets/images/background.jpg`)
		.label('Background image link')
		.description('Background image that should be used instead of the default background'),

	logoURL: Joi.string().uri().default(p => `${p.domain}/assets/images/logo.jpg`)
		.label('Logo image link')
		.description('Logo image that should be used instead of the default logo'),

	// Statistics settings
	// TODO: Pattern fails for patterns like 0 1,2-7 * * * * because of the mixing of lists and ranges
	statisticsCron: Joi.string().pattern(/((((\d+,)+\d+|([\d\*]+(\/|-)\d+)|\d+|\*) ?){6})/, { name: 'cron' }).default('0 0 * * * *')
		.label('Statistics schedule')
		.description('Crontab like formated value which will be used to schedule generating and saving stats to the database'),

	enabledStatistics: Joi.array().items(Joi.string().valid(...Object.keys(StatsGenerator.statGenerators)).optional())
		.meta({ displayType: 'checkbox' })
		.label('Enabled statistics')
		.description('Which statistics should be shown when opening the statistics page'),

	savedStatistics: Joi.array().items(Joi.string().valid(...Object.keys(StatsGenerator.statGenerators)).optional())
		.meta({ displayType: 'checkbox' })
		.label('Cached statistics')
		.description('Which statistics should be saved to the database (refer to Statistics schedule for scheduling).')
		.note('If a statistics is enabled but not set to be saved, it will be generated every time the statistics page is opened'),

	// Server related settings
	rateLimitWindow: Joi.number().integer().default(2)
		.label('API rate limit window')
		.description('Timeframe for which requests are checked/remembered'),

	rateLimitMax: Joi.number().integer().default(5)
		.label('API maximum limit')
		.description('Max number of connections during windowMs milliseconds before sending a 429 response')
});

module.exports.schema = schema;
module.exports.configSchema = schema.describe();
