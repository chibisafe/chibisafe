import type { Response } from 'hyper-express';
import type { RequestWithUser } from '../../../structures/interfaces';
import prisma from '../../../structures/database';

export const options = {
	url: '/admin/invites',
	method: 'get',
	middlewares: ['auth', 'admin']
};

export const run = async (req: RequestWithUser, res: Response) => {
	const invites = await prisma.invites.findMany();

	const response = [];
	for (const invite of invites) {
		const temp = {
			code: invite.code,
			createdBy: {} as any,
			used: invite.used,
			usedBy: {} as any,
			createdAt: invite.createdAt,
			editedAt: invite.editedAt
		};

		const createdBy = await prisma.users.findUnique({
			where: {
				uuid: invite.createdBy
			},
			select: {
				username: true,
				uuid: true
			}
		});

		temp.createdBy = createdBy;

		if (invite.used && invite.usedBy) {
			const usedBy = await prisma.users.findUnique({
				where: {
					uuid: invite.usedBy
				},
				select: {
					username: true,
					uuid: true
				}
			});

			temp.usedBy = usedBy;
		}

		response.push(temp);
	}

	return res.json({
		message: 'Successfully retrieved invites',
		invites: response
	});
};
