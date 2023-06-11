import type { FastifyRequest } from 'fastify';
import { SETTINGS } from '../structures/settings';
import randomstring from 'randomstring';
import { log } from '../main';
import prisma from '../structures/database';
import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';

export const getHost = (req: FastifyRequest) => `${req.protocol}://${req.headers.host}`;

export const getUniqueAlbumIdentifier = () => {
	const retry: any = async (i = 0) => {
		const identifier = randomstring.generate({
			length: SETTINGS.generatedAlbumLength,
			capitalization: 'lowercase'
		});
		const exists = await prisma.links.findFirst({
			where: {
				identifier
			}
		});
		if (!exists) return identifier;
		/*
			It's funny but if you do i++ the asignment never gets done resulting in an infinite loop
		*/
		if (i < 5) return retry(i + 1);
		log.error('Couldnt allocate identifier for album');
		return null;
	};

	return retry();
};

// A function that adds spaces to the beginning of the string until there are 7 characters
export const addSpaces = (str: string) => {
	const spaces = 7 - str.length;
	let newStr = '';
	for (let i = 0; i < spaces; i++) {
		newStr += ' ';
	}

	newStr += str;
	return newStr;
};

export const unlistenEmitters = (emitters: any[], eventName: string, listener?: (reason?: any) => void) => {
	if (!listener) return;
	for (const emitter of emitters) {
		if (!emitter) continue;
		emitter.off(eventName, listener);
	}
};

export const createAdminUserIfNotExists = async () => {
	const adminUser = await prisma.users.findFirst({
		where: {
			isAdmin: true
		}
	});

	if (!adminUser) {
		const hash = await bcrypt.hash('admin', 10);
		await prisma.users.create({
			data: {
				uuid: uuidv4(),
				username: 'admin',
				password: hash,
				isAdmin: true
			}
		});

		log.info('>>>');
		log.info('');
		log.info(`Created admin user with password: admin`);
		log.info('');
		log.info('>>>');
	}
};
