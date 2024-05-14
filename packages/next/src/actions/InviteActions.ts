'use server';

import { revalidateTag } from 'next/cache';
import { MessageType } from '@/types';
import request from '@/lib/request';
import { getToken } from './utils';

export const createInvite = async (_: FormData) => {
	try {
		const { error } = await request.post({
			url: 'admin/invite/create',
			headers: {
				authorization: `Bearer ${getToken()}`
			}
		});

		if (error) return { message: error, type: MessageType.Error };

		revalidateTag('invites');
		return {};
	} catch {
		return {};
	}
};

export const revokeInvite = async (uuid: string) => {
	try {
		const { error } = await request.post({
			url: 'admin/invite/delete',
			body: {
				code: uuid
			},
			headers: {
				authorization: `Bearer ${getToken()}`
			}
		});

		if (error) return { message: error, type: MessageType.Error };

		revalidateTag('invites');
		return { message: 'Invite revoked', type: MessageType.Success };
	} catch (error: any) {
		return { message: error, type: MessageType.Error };
	}
};
