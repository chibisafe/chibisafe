import path from 'node:path';
import type { FastifyReply } from 'fastify';
import jetpack from 'fs-jetpack';
import { getHighlighter, bundledLanguagesInfo, bundledLanguages } from 'shiki/bundle/full';
import { z } from 'zod';
import prisma from '@/structures/database.js';
import type { ExtendedFile, RequestWithUser } from '@/structures/interfaces.js';
import { http4xxErrorSchema } from '@/structures/schemas/HTTP4xxError.js';
import { http5xxErrorSchema } from '@/structures/schemas/HTTP5xxError.js';
import { responseMessageSchema } from '@/structures/schemas/ResponseMessage.js';
import { uploadPath } from '@/utils/File.js';

export const schema = {
	summary: 'Get file highlight',
	description: 'Highlight a file and get back a html representation of it.',
	tags: ['Files'],
	params: z
		.object({
			uuid: z.string().describe('The uuid of the file.')
		})
		.required(),
	response: {
		200: z.object({
			message: responseMessageSchema,
			html: z.string().describe('The highlighted HTML content of the file.')
		}),
		'4xx': http4xxErrorSchema,
		'5xx': http5xxErrorSchema
	}
};

export const options = {
	url: '/file/:uuid/highlight',
	method: 'get',
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
	const { uuid } = req.params as { uuid: string };

	const file = (await prisma.files.findFirst({
		where: {
			uuid
		},
		select: {
			name: true,
			isS3: true,
			size: true,
			type: true
		}
	})) as ExtendedFile | null;

	if (!file) {
		void res.notFound('The file could not be found');
		return;
	}

	if (file.isS3) {
		void res.badRequest('Files stored in S3 cannot be highlighted');
		return;
	}

	const extension = path.extname(file.name)?.split('.')?.[1];
	if (!extension) {
		void res.badRequest('The file has no extension');
		return;
	}

	const foundLanguage = bundledLanguagesInfo.find(language => {
		return language.aliases?.includes(extension) ?? language.id === extension;
	});

	const extensionsToIgnore = ['txt', 'log', 'srt'];

	if (!foundLanguage && !extensionsToIgnore.includes(extension)) {
		void res.badRequest('The file type is not supported');
		return;
	}

	const fileContents = jetpack.read(path.join(uploadPath, file.name));
	if (!fileContents) {
		void res.notFound('The file could not be found');
		return;
	}

	const highlighter = await getHighlighter({
		langs: Object.keys(bundledLanguages),
		themes: ['github-dark-dimmed']
	});

	const highlight = highlighter.codeToHtml(fileContents, {
		lang: foundLanguage?.id ?? 'plaintext',
		theme: 'github-dark-dimmed'
	});

	void res.send(highlight);
};
