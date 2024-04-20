import slugify from '@sindresorhus/slugify';
import type { FastifyReply } from 'fastify';
import moment from 'moment';
import { v4 as uuidv4 } from 'uuid';
import { z } from 'zod';
import prisma from '@/structures/database.js';
import type { RequestWithUser } from '@/structures/interfaces.js';
import { http4xxErrorSchema } from '@/structures/schemas/HTTP4xxError.js';
import { http5xxErrorSchema } from '@/structures/schemas/HTTP5xxError.js';
import { responseMessageSchema } from '@/structures/schemas/ResponseMessage.js';
import { SETTINGS } from '@/structures/settings.js';
import { constructShortLink, getUniqueShortLinkIdentifier } from '@/utils/Link.js';

export const schema = {
	summary: 'Create link',
	description: 'Create a new shortened link',
	tags: ['Links'],
	body: z.object({
		url: z.string().describe('The destination url.'),
		vanity: z.string().optional().describe('The vanity url to use.')
	}),
	response: {
		200: z.object({
			message: responseMessageSchema,
			link: z.object({
				uuid: z.string().describe('The uuid of the link.'),
				identifier: z.string().describe('The identifier of the link.'),
				link: z.string().describe('The shortened link.')
			})
		}),
		'4xx': http4xxErrorSchema,
		'5xx': http5xxErrorSchema
	}
};

export const options = {
	url: '/link/create',
	method: 'post',
	middlewares: [
		{
			name: 'apiKey'
		},
		{
			name: 'auth'
		}
	]
};

export const run = async (req: RequestWithUser, res: FastifyReply) => {
	if (!SETTINGS.useUrlShortener) {
		void res.notImplemented('URL shortener is disabled');
		return;
	}

	const { url, vanity } = req.body as { url: string; vanity?: string | undefined };
	const now = moment.utc().toDate();

	let linkToUse;

	if (vanity) {
		const tempFullUrl = constructShortLink(req, vanity);
		if (tempFullUrl === url) {
			void res.badRequest('Custom URL cannot be the same as the destination URL');
			return;
		}

		const sluggifiedVanity = slugify(vanity, { separator: '_', decamelize: false, lowercase: false });
		const existingLink = await prisma.shortenedLinks.findFirst({
			where: {
				identifier: sluggifiedVanity
			}
		});

		// If the vanity url doesn't exist, we'll use it
		if (!existingLink) {
			linkToUse = sluggifiedVanity;
		}
	}

	// If linkToUse is still undefined, we'll generate a unique identifier
	if (!linkToUse) {
		const uniqueIdentifier = await getUniqueShortLinkIdentifier();
		if (!uniqueIdentifier) {
			void res.internalServerError('Couldnt allocate identifier for link');
			return;
		}

		linkToUse = uniqueIdentifier;
	}

	const link = await prisma.shortenedLinks.create({
		data: {
			destination: url,
			identifier: linkToUse,
			userId: req.user.id,
			uuid: uuidv4(),
			createdAt: now
		}
	});

	return res.send({
		message: 'Successfully created link',
		link: {
			uuid: link.uuid,
			identifier: link.identifier,
			link: constructShortLink(req, link.identifier)
		}
	});
};
