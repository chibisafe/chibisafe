require('dotenv').config();

const nodePath = require('path');
const moment = require('moment');
const jetpack = require('fs-jetpack');
const ThumbUtil = require('../utils/ThumbUtil');

const oldDb = require('knex')({
	client: 'sqlite3',
	connection: {
		filename: nodePath.join(__dirname, '../../', 'db')
	},
	useNullAsDefault: true
});

const newDb = require('knex')({
	client: 'sqlite3',
	connection: {
		filename: nodePath.join(__dirname, '../../database/', 'database.sqlite')
	},
	postProcessResponse: result => {
		const booleanFields = ['enabled', 'enableDownload', 'isAdmin', 'nsfw', 'generateZips', 'publicMode', 'userAccounts'];

		const processResponse = row => {
			Object.keys(row).forEach(key => {
				if (booleanFields.includes(key)) {
					if (row[key] === 0) row[key] = false;
					else if (row[key] === 1) row[key] = true;
				}
			});
			return row;
		};

		if (Array.isArray(result)) return result.map(row => processResponse(row));
		if (typeof result === 'object') return processResponse(result);
		return result;
	},
	useNullAsDefault: true
});

const start = async () => {
	console.log('Starting migration, this may take a few minutes...'); // Because I half assed it
	console.log('Please do NOT kill the process. Wait for it to finish.');

	await jetpack.removeAsync(nodePath.join(__dirname, '../../uploads/thumbs'));
	await jetpack.dirAsync(nodePath.join(__dirname, '../../uploads/thumbs/square'));
	console.log('Finished deleting old thumbnails to create new ones');

	const users = await oldDb.table('users').where('username', '<>', 'root');
	for (const user of users) {
		const now = moment.utc().toDate();
		const userToInsert = {
			id: user.id,
			username: user.username,
			password: user.password,
			enabled: user.enabled,
			isAdmin: false,
			apiKey: user.token,
			passwordEditedAt: now,
			apiKeyEditedAt: now,
			createdAt: now,
			editedAt: now
		};
		await newDb.table('users').insert(userToInsert);
	}
	console.log('Finished migrating users...');

	const albums = await oldDb.table('albums');
	for (const album of albums) {
		if (!album.enabled || album.enabled == 0) continue;
		const now = moment.utc().toDate();
		const albumToInsert = {
			id: album.id,
			userId: album.userid,
			name: album.name,
			zippedAt: album.zipGeneratedAt ? moment.unix(album.zipGeneratedAt).toDate() : null,
			createdAt: moment.unix(album.timestamp).toDate(),
			editedAt: moment.unix(album.editedAt).toDate()
		};
		const linkToInsert = {
			userId: album.userid,
			albumId: album.id,
			identifier: album.identifier,
			views: 0,
			enabled: true,
			enableDownload: true,
			createdAt: now,
			editedAt: now
		};
		await newDb.table('albums').insert(albumToInsert);
		const insertedId = await newDb.table('links').insert(linkToInsert);
		await newDb.table('albumsLinks').insert({
			albumId: album.id,
			linkId: insertedId[0]
		});
	}
	console.log('Finished migrating albums...');

	const files = await oldDb.table('files');
	const filesToInsert = [];
	const albumsFilesToInsert = [];
	for (const file of files) {
		const fileToInsert = {
			id: file.id,
			userId: file.userid,
			name: file.name,
			original: file.original,
			type: file.type,
			size: file.size,
			hash: file.hash,
			ip: file.ip,
			createdAt: moment.unix(file.timestamp).toDate(),
			editedAt: moment.unix(file.timestamp).toDate()
		};
		filesToInsert.push(fileToInsert);
		if (file.albumid) {
			albumsFilesToInsert.push({
				albumId: file.albumid,
				fileId: file.id
			});
		}

		const filename = file.name;
		if (!jetpack.exists(nodePath.join(__dirname, '../../uploads', filename))) continue;
		ThumbUtil.generateThumbnails(filename);
	}
	await newDb.batchInsert('files', filesToInsert, 20);
	await newDb.batchInsert('albumsFiles', albumsFilesToInsert, 20);
	console.log('Finished migrating files...');

	console.log('Finished migrating everything. ');
	process.exit(0);
};

start();
