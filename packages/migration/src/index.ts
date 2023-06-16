import path from 'node:path';
import { PrismaClient } from '@prisma/client';
import { intro, outro, text, spinner } from '@clack/prompts';
import betterSqlite from 'better-sqlite3';
import { v4 as uuidv4 } from 'uuid';

type sqliteUser = {
	id: number;
	username: string;
	password: string;
	enabled: 0 | 1;
	isAdmin: 0 | 1;
	apiKey: string | null;
	passwordEditedAt: number;
	apiKeyEditedAt: number | null;
	createdAt: number;
	editedAt: number;
};

type sqliteAlbum = {
	id: number;
	userId: number;
	name: string;
	createdAt: number;
	editedAt: number;
	nsfw: boolean;
	zippedAt: number | null;
};

type sqliteLink = {
	id: number;
	userId: number;
	albumId: number;
	identifier: string;
	views: number;
	enabled: boolean;
	enabledDownload: boolean;
	expiresAt: number | null;
	createdAt: number;
	editedAt: number;
};

type sqliteFile = {
	id: number;
	userId: number;
	name: string;
	original: string;
	type: string;
	size: number;
	hash: string;
	ip: string;
	createdAt: number;
	editedAt: number;
};

const getPrismaUserId = (
	sqliteUserId: number,
	sqliteUsers: sqliteUser[],
	prismaUsers: { id: number; username: string }[]
) => {
	const sqliteUser = sqliteUsers.find(user => user.id === sqliteUserId);
	const prismaUser = prismaUsers.find(user => user.username === sqliteUser?.username);
	if (!prismaUser) {
		throw new Error(`Could not find user with id ${sqliteUserId}`);
	}

	return prismaUser.id;
};

const getPrismaAlbumId = (
	sqliteAlbumId: number,
	sqliteAlbums: sqliteAlbum[],
	prismaAlbums: { id: number; name: string }[]
) => {
	const sqliteAlbum = sqliteAlbums.find(album => album.id === sqliteAlbumId);
	const prismaAlbum = prismaAlbums.find(album => album.name === sqliteAlbum?.name);
	if (!prismaAlbum) {
		throw new Error(`Could not find album with id ${sqliteAlbumId}`);
	}

	return prismaAlbum.id;
};

const start = async () => {
	const loading = spinner();
	intro('This tool will help you migrate from chibisafe v4 to chibisafe v5');

	// TODO: tell the suer they can only run this if the database is empty
	// const databaseLocation = await text({
	// 	message: 'Paste the full location to your Chibisafe v4 database file',
	// 	placeholder: '    (For example /home/chibisafe/database/database.sqlite)',
	// 	initialValue: '',
	// 	validate(value) {
	// 		if (value.length === 0) return `Value is required!`;
	// 		if (!value.endsWith('.sqlite')) return `Value must be a .sqlite file!`;
	// 	}
	// });

	const prisma = new PrismaClient();
	const tempPath = path.join(__dirname, '..', 'test', 'database.sqlite');
	// const sqlite = betterSqlite(databaseLocation as string);
	const sqlite = betterSqlite(tempPath);

	const sqliteUsers = sqlite.prepare('SELECT * FROM users').all() as sqliteUser[];
	const sqliteAlbums = sqlite.prepare('SELECT * FROM albums').all() as sqliteAlbum[];
	const sqliteLinks = sqlite.prepare('SELECT * FROM links').all() as sqliteLink[];
	const sqliteFiles = sqlite.prepare('SELECT * FROM files').all() as sqliteFile[];

	loading.start('Processing users');
	for (const user of sqliteUsers) {
		const userExists = await prisma.users.findFirst({
			where: {
				username: user.username
			}
		});

		if (userExists) {
			continue;
		}

		await prisma.users.create({
			data: {
				uuid: uuidv4(),
				apiKey: user.apiKey,
				apiKeyEditedAt: user.apiKeyEditedAt ? new Date(user.apiKeyEditedAt) : null,
				createdAt: new Date(user.createdAt),
				editedAt: new Date(user.editedAt),
				passwordEditedAt: new Date(user.passwordEditedAt),
				username: user.username,
				password: user.password,
				enabled: user.enabled === 1,
				isAdmin: user.isAdmin === 1
			}
		});
	}

	loading.stop('Processed all users');

	// Save the users in a variable so we can use it later
	const prismaUsers = await prisma.users.findMany();

	loading.start('Processing albums');
	for (const album of sqliteAlbums) {
		const albumExists = await prisma.albums.findFirst({
			where: {
				userId: getPrismaUserId(album.userId, sqliteUsers, prismaUsers),
				name: album.name
			}
		});

		if (albumExists) {
			continue;
		}

		await prisma.albums.create({
			data: {
				uuid: uuidv4(),
				userId: getPrismaUserId(album.userId, sqliteUsers, prismaUsers),
				name: album.name,
				zippedAt: album.zippedAt ? new Date(album.zippedAt) : null,
				createdAt: new Date(album.createdAt),
				editedAt: new Date(album.editedAt),
				nsfw: album.nsfw
			}
		});
	}

	loading.stop('Processed all albums');

	// Save the albums in a variable so we can use it later
	const prismaAlbums = await prisma.albums.findMany();

	loading.start('Processing album links');
	for (const link of sqliteLinks) {
		await prisma.links.create({
			data: {
				uuid: uuidv4(),
				userId: getPrismaUserId(link.userId, sqliteUsers, prismaUsers),
				albumId: getPrismaAlbumId(link.albumId, sqliteAlbums, prismaAlbums),
				identifier: link.identifier,
				views: link.views,
				enabled: link.enabled,
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
				uuid: uuidv4(),
				userId: getPrismaUserId(file.userId, sqliteUsers, prismaUsers),
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

	outro(`You're all set!`);
};

void start();
