'use server';

import { revalidateTag } from 'next/cache';
import { MessageType } from '@/types';
import request from '@/lib/request';
import { getToken } from './utils';

export const unbanIp = async (ip: string) => {
	try {
		const { error } = await request.post({
			url: 'admin/ip/unban',
			body: {
				ip
			},
			headers: {
				authorization: `Bearer ${getToken()}`
			}
		});

		if (error) return { message: error, type: MessageType.Error };

		revalidateTag('ips');
		return { message: 'IP unbanned', type: MessageType.Success };
	} catch (error: any) {
		return { message: error, type: MessageType.Error };
	}
};

export const banIp = async (_: any, form: FormData) => {
	const ip = form.get('ip') as string;
	const reason = form.get('reason') as string;
	try {
		const { error } = await request.post({
			url: 'admin/ip/ban',
			body: {
				ip,
				reason
			},
			headers: {
				authorization: `Bearer ${getToken()}`
			}
		});

		if (error) return { message: error, type: MessageType.Error };

		revalidateTag('ips');
		return { message: 'IP banned', type: MessageType.Success };
	} catch (error: any) {
		return { message: error, type: MessageType.Error };
	}
};

export const purgeIp = async (ip: string) => {
	try {
		const { error } = await request.post({
			url: 'admin/ip/purge',
			body: {
				ip
			},
			headers: {
				authorization: `Bearer ${getToken()}`
			}
		});

		if (error) return { message: error, type: MessageType.Error };

		revalidateTag('ips');
		return { message: 'IP files purged', type: MessageType.Success };
	} catch (error: any) {
		return { message: error, type: MessageType.Error };
	}
};
