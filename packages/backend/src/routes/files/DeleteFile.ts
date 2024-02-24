import type { FastifyReply } from 'fastify';
import { z } from 'zod';
import prisma from '@/structures/database.js';
import type { RequestWithUser } from '@/structures/interfaces.js';
import { http4xxErrorSchema } from '@/structures/schemas/HTTP4xxError.js';
import { http5xxErrorSchema } from '@/structures/schemas/HTTP5xxError.js';
import { responseMessageSchema } from '@/structures/schemas/ResponseMessage.js';
import { deleteFiles } from '@/utils/File.js';

export const schema = {
	summary: 'Delete file',
	description: 'Deletes a file',
	tags: ['Files'],
	params: z
		.object({
			uuid: z.string().describe('The uuid of the file.')
		})
		.required(),
	response: {
		200: z.object({
			message: responseMessageSchema
		}),
		'4xx': http4xxErrorSchema,
		'5xx': http5xxErrorSchema
	}
};

export const options = {
	url: '/file/:uuid',
	method: 'delete',
	middlewares: ['apiKey', 'auth']
};

export const run = async (req: RequestWithUser, res: FastifyReply) => {
	const { uuid } = req.params as { uuid: string };

	const file = await prisma.files.findFirst({
		where: {
			userId: req.user.id,
			uuid
		},
		select: {
			uuid: true,
			name: true,
			quarantine: true,
			quarantineFile: true,
			isS3: true,
			isWatched: true
		}
	});

	if (!file) {
		void res.notFound("The file doesn't exist or doesn't belong to the user");
		return;
	}

	// Delete the file from the DB
	await prisma.files.delete({
		where: {
			uuid
		}
	});

	// Remove the file from disk
	await deleteFiles({ files: [file] });

	return res.send({
		message: 'Successfully deleted the file'
	});
};
