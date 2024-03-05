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

export const unbanIp = async (_: any, form: FormData) => {
	const ip = form.get('ip') as string;

	try {
		await request.post(
			'admin/ip/unban',
			{
				ip
			},
			{
				authorization: `Bearer ${getToken()}`
			}
		);

		revalidateTag('ips');
		return { message: 'IP unbanned', type: MessageType.Success };
	} catch (error: any) {
		return { message: error.message, type: MessageType.Error };
	}
};

export const banIp = async (_: any, form: FormData) => {
	const ip = form.get('ip') as string;

	try {
		await request.post(
			'admin/ip/ban',
			{
				ip
			},
			{
				authorization: `Bearer ${getToken()}`
			}
		);

		revalidateTag('ips');
		return { message: 'IP banned', type: MessageType.Success };
	} catch (error: any) {
		return { message: error.message, type: MessageType.Error };
	}
};

export const purgeIp = async (_: any, form: FormData) => {
	const ip = form.get('ip') as string;

	try {
		await request.post(
			'admin/ip/files/purge',
			{
				ip
			},
			{
				authorization: `Bearer ${getToken()}`
			}
		);

		revalidateTag('ips');
		return { message: 'IP purged', type: MessageType.Success };
	} catch (error: any) {
		return { message: error.message, type: MessageType.Error };
	}
};
