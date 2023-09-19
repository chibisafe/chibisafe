import JWT from 'jsonwebtoken';
import prisma from '@/structures/database.js';
import type { RequestUser } from '@/structures/interfaces.js';
import { SETTINGS } from '@/structures/settings.js';

export const authUser = async (authorization?: string | null) => {
	if (!authorization) return null;

	const token = authorization.split(' ')[1];
	if (!token) throw new Error('Malformed authorization header');

	let id;
	let dateSigned;

	try {
		const decoded = JWT.verify(token, SETTINGS.secret ?? '');
		id = decoded.sub ?? null;
		// @ts-ignore
		dateSigned = decoded.iat ?? null;
		if (!id) throw new Error('Invalid authorization');
	} catch {
		throw new Error('Invalid token');
	}

	const user = await prisma.users.findFirst({
		where: {
			id: id as unknown as number
		},
		select: {
			id: true,
			uuid: true,
			username: true,
			roles: {
				select: {
					name: true
				}
			},
			apiKey: true,
			passwordEditedAt: true
		}
	});

	if (dateSigned && Number(user?.passwordEditedAt) > dateSigned) {
		throw new Error('Expired token');
	}

	if (!user) throw new Error("User doesn't exist");
	return {
		id: user.id,
		uuid: user.uuid,
		username: user.username,
		roles: user.roles,
		apiKey: user.apiKey
	} as RequestUser;
};

export const validateAlbum = async (albumUuid?: string | null, user?: any) => {
	if (!albumUuid) return null;
	if (!user) throw new Error('Only registered users can upload files to an album.');

	const album = await prisma.albums.findFirst({
		where: {
			uuid: albumUuid,
			userId: user.id
		}
	});
	if (!album) throw new Error("Album doesn't exist or it doesn't belong to the user.");
	return album.id;
};
