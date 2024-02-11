import type { FastifyReply } from 'fastify';
import { z } from 'zod';
import type { RequestWithUser } from '@/structures/interfaces.js';
import { http4xxErrorSchema } from '@/structures/schemas/HTTP4xxError.js';
import { http5xxErrorSchema } from '@/structures/schemas/HTTP5xxError.js';
import { constructFilePublicLink, uploadFilefromURL } from '@/utils/File.js';
import { log } from '@/utils/Logger.js';
import { validateAlbum } from '@/utils/UploadHelpers.js';
export const schema = {
	summary: 'Upload file from a URL',
	description: 'Uploads a file from a URL',
	tags: ['Files'],
	headers: z.object({
		albumuuid: z.string().optional().describe('The uuid of the album.')
	}),
	body: z
		.object({
			url: z.string().describe('The URL of the file.')
		})
		.required(),
	response: {
		200: z.object({
			name: z.string().describe('The name of the file.'),
			uuid: z.string().describe('The uuid of the file.'),
			url: z.string().describe('The URL of the file.'),
			publicUrl: z.string().optional().describe('The public URL of the file.')
		}),
		204: z.null(),
		'4xx': http4xxErrorSchema,
		'5xx': http5xxErrorSchema
	}
};

export const options = {
	url: '/upload/url',
	method: 'post',
	middlewares: [
		{
			name: 'apiKey'
		},
		{
			name: 'auth',
			optional: true
		}
	]
};

export const run = async (req: RequestWithUser, res: FastifyReply) => {
	log.debug('Uploading file from URL');
	if (!req.user) {
		log.error('Missing user information');
		void res.internalServerError('Missing user information');
		return;
	}

	const { url } = req.body as { url: string };
	const album = await validateAlbum(req.headers.albumuuid as string, req.user ? req.user : undefined);
	if (!url) {
		log.error('Missing file information');
		void res.badRequest('Missing file information');
		return;
	}

	log.info(`Uploading file from URL: ${url}`);
	const file = await uploadFilefromURL({
		url,
		ip: req.ip,
		user: req.user,
		albumId: album ? album : null
	});
	if (!file) {
		void res.internalServerError('Failed to upload file');
	}

	log.info(`File created: ${file.name} (${file.uuid})`);
	const linkData = constructFilePublicLink({ req, fileName: file.name });
	log.info(`File public link: ${linkData.url}`);

	log.info('File updated on database');

	await res.status(200).send({
		name: file.name,
		uuid: file.uuid,
		url,
		publicUrl: linkData.url
	});
};
