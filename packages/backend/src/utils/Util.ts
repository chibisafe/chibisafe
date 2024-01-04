import { readFileSync } from 'node:fs';
import { URL, fileURLToPath } from 'node:url';
import bcrypt from 'bcryptjs';
import type { FastifyRequest } from 'fastify';
import randomstring from 'randomstring';
import { v4 as uuidv4 } from 'uuid';
import prisma from '@/structures/database.js';
import { SETTINGS } from '@/structures/settings.js';
import { log } from '@/utils/Logger.js';

const basePackageJson = fileURLToPath(new URL('../../../../package.json', import.meta.url));
export const VERSION = JSON.parse(readFileSync(basePackageJson, 'utf8')).version;

export const getHost = (req: FastifyRequest) => `${req.protocol}://${req.headers.host}`;
export const getChibisafeVersion = () => VERSION;

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
export const addSpaces = (str: string, amount = 7) => {
	const spaces = amount - str.length;
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
	const ownerUser = await prisma.users.findFirst({
		where: {
			roles: {
				some: {
					name: 'owner'
				}
			}
		}
	});

	if (!ownerUser) {
		const hash = await bcrypt.hash('admin', 10);
		await prisma.users.create({
			data: {
				uuid: uuidv4(),
				username: 'admin',
				password: hash,
				roles: {
					connect: [
						{
							name: 'owner'
						},
						{
							name: 'admin'
						}
					]
				}
			}
		});

		log.info('>>>');
		log.info('');
		log.info(`Created admin user with password: admin`);
		log.info('');
		log.info('>>>');
	}
};
