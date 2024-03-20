'use server';

import { MessageType } from '@/types';
import request from '@/lib/request';
import { revalidateTag } from 'next/cache';
import { getToken } from './utils';

export const changePassword = async (_: any, form: FormData) => {
	const password = form.get('currentpassword') as string;
	const newPassword = form.get('newpassword') as string;
	const rePassword = form.get('repassword') as string;

	if (!password) return { message: 'Password is required', type: MessageType.Error };
	if (!newPassword) return { message: 'New password is required', type: MessageType.Error };
	if (!rePassword) return { message: 'Repeat password is required', type: MessageType.Error };
	if (newPassword !== rePassword) return { message: 'Passwords do not match', type: MessageType.Error };

	try {
		const { error } = await request.post({
			url: 'auth/password/change',
			body: {
				password,
				newPassword
			},
			headers: {
				authorization: `Bearer ${getToken()}`
			}
		});

		if (error) return { message: error, type: MessageType.Error };

		revalidateTag('me');
		return { message: 'Password changed', type: MessageType.Success };
	} catch (error: any) {
		return { message: error, type: MessageType.Error };
	}
};

export const requestNewApiKey = async (_: any, __: FormData) => {
	try {
		const { error } = await request.post({
			url: 'auth/apikey/change',
			headers: {
				authorization: `Bearer ${getToken()}`
			}
		});

		if (error) return { message: error, type: MessageType.Error };

		revalidateTag('me');
		return { message: 'API key regenerated', type: MessageType.Success };
	} catch (error: any) {
		return { message: error, type: MessageType.Error };
	}
};
