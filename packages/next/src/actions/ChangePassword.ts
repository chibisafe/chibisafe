'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { MessageType } from '@/types';

import request from '@/lib/request';

export const changePassword = async (_: any, form: FormData) => {
	const cookieStore = cookies();
	const token = cookieStore.get('token')?.value;
	if (!token) redirect('/');

	const password = form.get('currentpassword') as string;
	const newPassword = form.get('newpassword') as string;
	const rePassword = form.get('repassword') as string;

	if (!password) return { message: 'Password is required', type: MessageType.Error };
	if (!newPassword) return { message: 'New password is required', type: MessageType.Error };
	if (!rePassword) return { message: 'Repeat password is required', type: MessageType.Error };
	if (newPassword !== rePassword) return { message: 'Passwords do not match', type: MessageType.Error };

	try {
		await request.post(
			'auth/password/change',
			{
				password,
				newPassword
			},
			{
				authorization: `Bearer ${token}`
			}
		);

		return { message: 'Password changed', type: MessageType.Success };
	} catch (error: any) {
		return { message: error.message, type: MessageType.Error };
	}
};
