'use server';

import { revalidateTag } from 'next/cache';
import { MessageType } from '@/types';
import request from '@/lib/request';
import { getToken } from './utils';

export const createInvite = async (_: FormData) => {
	try {
		const { error } = await request.post(
			'admin/invite/create',
			{},
			{
				authorization: `Bearer ${getToken()}`
			}
		);

		if (error) return { message: error, type: MessageType.Error };

		revalidateTag('invites');
		return {};
	} catch {
		return {};
	}
};

export const revokeInvite = async (_: any, form: FormData) => {
	const code = form.get('code') as string;

	try {
		const { error } = await request.post(
			'admin/invite/delete',
			{
				code
			},
			{
				authorization: `Bearer ${getToken()}`
			}
		);

		if (error) return { message: error, type: MessageType.Error };

		revalidateTag('ips');
		return { message: 'Invite revoked', type: MessageType.Success };
	} catch (error: any) {
		return { message: error, type: MessageType.Error };
	}
};
