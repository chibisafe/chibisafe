import type { FastifyReply } from 'fastify';
import { z } from 'zod';
import prisma from '@/structures/database.js';
import type { RequestWithUser } from '@/structures/interfaces.js';
import { http4xxErrorSchema } from '@/structures/schemas/HTTP4xxError.js';
import { http5xxErrorSchema } from '@/structures/schemas/HTTP5xxError.js';

export const schema = {
	summary: 'Delete invite',
	description: 'Delete an invite',
	tags: ['Invites'],
	body: z.object({
		code: z.string().describe('The code of the invite to delete.')
	}),
	response: {
		200: z.object({
			message: z.string().describe('The response message.')
		}),
		'4xx': http4xxErrorSchema,
		'5xx': http5xxErrorSchema
	}
};

export const options = {
	url: '/admin/invite/delete',
	method: 'post',
	middlewares: ['apiKey', 'auth', 'admin']
};

export const run = async (req: RequestWithUser, res: FastifyReply) => {
	const { code }: { code: string } = req.body as { code: string };
	if (!code) {
		void res.badRequest('No code provided');
		return;
	}

	const invite = await prisma.invites.findUnique({
		where: {
			code
		}
	});

	if (invite?.used) {
		void res.notFound('Invite has already been used');
		return;
	}

	await prisma.invites.delete({
		where: {
			code
		}
	});

	return res.send({ message: 'Successfully deleted invite' });
};
