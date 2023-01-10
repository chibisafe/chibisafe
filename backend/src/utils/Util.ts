import type { Request } from 'hyper-express';
import { SETTINGS } from '../structures/settings';
import randomstring from 'randomstring';
import log from './Log';
import prisma from '../structures/database';

export const getHost = (req: Request) => `${req.protocol}://${req.headers.host}`;

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
