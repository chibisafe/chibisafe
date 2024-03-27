import process from 'node:process';
import { intro, outro, text, spinner, confirm } from '@clack/prompts';
import { PrismaClient } from '@prisma/client';
import betterSqlite from 'better-sqlite3';
import { v4 as uuidv4 } from 'uuid';

type sqliteUser = {
	apiKey: string | null;
	apiKeyEditedAt: number | null;
	createdAt: number;
	editedAt: number;
	enabled: 0 | 1;
	id: number;
	isAdmin: 0 | 1;
	password: string;
	passwordEditedAt: number;
	username: string;
};

type sqliteAlbum = {
	createdAt: number;
	editedAt: number;
	id: number;
	name: string;
	nsfw: boolean;
	userId: number;
	zippedAt: number | null;
};

type sqliteLink = {
	albumId: number;
	createdAt: number;
	editedAt: number;
	enabled: boolean;
	enabledDownload: boolean;
	expiresAt: number | null;
	id: number;
	identifier: string;
	userId: number;
	views: number;
};

type sqliteFile = {
	createdAt: number;
	editedAt: number;
	hash: string;
	id: number;
	ip: string;
	name: string;
	original: string;
	size: number;
	type: string;
	userId: number;
};

type sqliteAlbumFile = {
	albumId: number;
	fileId: number;
	id: number;
};

const start = async () => {
	const loading = spinner();
	intro(
		'This tool will help you migrate from chibisafe v4 to chibisafe v5 \n   Keep in mind this will delete the admin account created by chibisafe v5 \n   Once this migration is done, you should be able to log in with your \n   old username and password \n\n   NOTE: THIS WILL DELETE EVERYTHING IN THE CHIBISAFE V5 DATABASE'
	);

	const acceptAndContinue = await confirm({
		message: 'Do you want to continue?'
	});

	if (!acceptAndContinue) {
		process.exit(0);
	}

	const databaseLocation = await text({
		message: 'Paste the full location to your Chibisafe v4 database file',
		placeholder: '    (For example /home/chibisafe/database/database.sqlite)',
		initialValue: '',
		validate(value) {
			if (value.length === 0) return `Value is required!`;
			if (!value.endsWith('.sqlite')) return `Value must be a .sqlite file!`;
			return '';
		}
	});

	const prisma = new PrismaClient();
	// const tempPath = path.join(__dirname, '..', 'test', 'database.sqlite');
	// const sqlite = betterSqlite(tempPath);
	const sqlite = betterSqlite(databaseLocation as string);

	const sqliteUsers = sqlite.prepare('SELECT * FROM users').all() as sqliteUser[];
	const sqliteAlbums = sqlite.prepare('SELECT * FROM albums').all() as sqliteAlbum[];
	const sqliteLinks = sqlite.prepare('SELECT * FROM links').all() as sqliteLink[];
	const sqliteFiles = sqlite.prepare('SELECT * FROM files').all() as sqliteFile[];
	const sqliteAlbumFiles = sqlite.prepare('SELECT * FROM albumsFiles').all() as sqliteAlbumFile[];

	// ============================ COMMENT RIGHT HERE
	loading.start('Deleting all data from the database');
	await prisma.$executeRawUnsafe('Delete from users');
	await prisma.$executeRawUnsafe("DELETE FROM SQLITE_SEQUENCE WHERE name='users';");
	await prisma.$executeRawUnsafe('Delete from albums');
	await prisma.$executeRawUnsafe("DELETE FROM SQLITE_SEQUENCE WHERE name='albums';");
	await prisma.$executeRawUnsafe('Delete from links');
	await prisma.$executeRawUnsafe("DELETE FROM SQLITE_SEQUENCE WHERE name='links';");
	await prisma.$executeRawUnsafe('Delete from files');
	await prisma.$executeRawUnsafe("DELETE FROM SQLITE_SEQUENCE WHERE name='files';");
	loading.stop('Deleted all data from the database');

	loading.start('Processing users');
	for (const user of sqliteUsers) {
		await prisma.users.create({
			data: {
				id: user.id,
				uuid: uuidv4(),
				apiKey: user.apiKey,
				apiKeyEditedAt: user.apiKeyEditedAt ? new Date(user.apiKeyEditedAt) : null,
				createdAt: new Date(user.createdAt),
				editedAt: new Date(user.editedAt),
				passwordEditedAt: new Date(user.passwordEditedAt),
				username: user.username,
				password: user.password,
				enabled: user.enabled === 1,
				roles: {
					connect: {
						name: user.isAdmin === 1 ? 'admin' : 'user'
					}
				}
			}
		});
	}

	loading.stop('Processed all users');

	loading.start('Processing albums');
	for (const album of sqliteAlbums) {
		await prisma.albums.create({
			data: {
				id: album.id,
				uuid: uuidv4(),
				userId: album.userId,
				name: album.name,
				zippedAt: album.zippedAt ? new Date(album.zippedAt) : null,
				createdAt: new Date(album.createdAt),
				editedAt: new Date(album.editedAt),
				nsfw: Boolean(album.nsfw)
			}
		});
	}

	loading.stop('Processed all albums');

	loading.start('Processing album links');
	for (const link of sqliteLinks) {
		await prisma.links.create({
			data: {
				id: link.id,
				uuid: uuidv4(),
				userId: link.userId,
				albumId: link.albumId,
				identifier: link.identifier,
				views: link.views,
				enabled: Boolean(link.enabled),
				enableDownload: link.enabledDownload,
				expiresAt: link.expiresAt ? new Date(link.expiresAt) : null,
				createdAt: new Date(link.createdAt),
				editedAt: new Date(link.editedAt)
			}
		});
	}

	loading.stop('Processed all album links');

	loading.start('Processing files');
	for (const file of sqliteFiles) {
		await prisma.files.create({
			data: {
				id: file.id,
				uuid: uuidv4(),
				name: file.name,
				original: file.original,
				type: file.type,
				size: String(file.size),
				hash: file.hash,
				ip: file.ip,
				createdAt: new Date(file.createdAt),
				editedAt: new Date(file.editedAt)
			}
		});
	}

	loading.stop('Processed all files');

	const prismaFiles = await prisma.files.findMany();

	loading.start('Processing file-album relations');
	const everyAlbum = await prisma.albums.findMany();

	for (const file of prismaFiles) {
		const foundAlbumRelation = sqliteAlbumFiles.find((albumFile: any) => albumFile.fileId === file.id);
		if (!foundAlbumRelation?.albumId) continue;
		if (typeof foundAlbumRelation.albumId !== 'number') continue;

		const albumExists = everyAlbum.find((album: any) => album.id === foundAlbumRelation.albumId);
		if (!albumExists) continue;

		await prisma.files.update({
			where: {
				id: file.id
			},
			data: {
				albums: {
					connect: {
						id: foundAlbumRelation.albumId
					}
				}
			}
		});
	}

	loading.stop('Processed file-album relations');

	loading.start('Processing file-user relations');
	for (const file of prismaFiles) {
		const foundUserRelation = sqliteFiles.find((sqliteFile: any) => sqliteFile.id === file.id);
		if (!foundUserRelation?.userId) continue;
		if (typeof foundUserRelation.userId !== 'number') continue;

		await prisma.files.update({
			where: {
				id: file.id
			},
			data: {
				user: {
					connect: {
						id: foundUserRelation.userId
					}
				}
			}
		});
	}

	loading.stop('Processed file-user relations');

	outro(`You're all set! The final step is to copy your old ./uploads folder to the root of this project.`);
};

void start();
