'use server';

import { revalidateTag } from 'next/cache';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { MessageType } from '@/types';

import request from '@/lib/request';

const getToken = () => {
	const cookieStore = cookies();
	const token = cookieStore.get('token')?.value;
	if (!token) redirect('/');
	return token;
};

export const createInvite = async (_: FormData) => {
	try {
		await request.post(
			'admin/invite/create',
			{},
			{
				authorization: `Bearer ${getToken()}`
			}
		);

		revalidateTag('invites');
		return {};
	} catch {
		return {};
	}
};

export const revokeInvite = async (_: any, form: FormData) => {
	const code = form.get('code') as string;

	try {
		await request.post(
			'admin/invite/delete',
			{
				code
			},
			{
				authorization: `Bearer ${getToken()}`
			}
		);

		revalidateTag('ips');
		return { message: 'Invite revoked', type: MessageType.Success };
	} catch (error: any) {
		return { message: error.message, type: MessageType.Error };
	}
};
