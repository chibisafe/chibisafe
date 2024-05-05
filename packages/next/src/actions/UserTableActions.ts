'use server';

import { revalidateTag } from 'next/cache';
import { MessageType } from '@/types';
import request from '@/lib/request';
import { getToken } from './utils';

export const setQuota = async (_: any, form: FormData) => {
	const uuid = form.get('uuid') as string;

	try {
		const { error } = await request.post({
			url: `admin/user/${uuid}/quota`,
			body: {
				space: form.get('space')
			},
			headers: {
				authorization: `Bearer ${getToken()}`
			},
			options: {
				next: {
					tags: ['users']
				}
			}
		});

		if (error) return { message: error, type: MessageType.Error };

		revalidateTag('users');
		return { message: 'New quota set', type: MessageType.Success };
	} catch (error: any) {
		return { message: error, type: MessageType.Error };
	}
};

export const enableUser = async (uuid: string) => {
	try {
		const { error } = await request.post({
			url: `admin/user/${uuid}/enable`,
			headers: {
				authorization: `Bearer ${getToken()}`
			},
			options: {
				next: {
					tags: ['users']
				}
			}
		});

		if (error) return { message: error, type: MessageType.Error };

		revalidateTag('users');
		return { message: 'User enabled', type: MessageType.Success };
	} catch (error: any) {
		return { message: error, type: MessageType.Error };
	}
};

export const disableUser = async (uuid: string) => {
	try {
		const { error } = await request.post({
			url: `admin/user/${uuid}/disable`,
			headers: {
				authorization: `Bearer ${getToken()}`
			},
			options: {
				next: {
					tags: ['users']
				}
			}
		});

		if (error) return { message: error, type: MessageType.Error };

		revalidateTag('users');
		return { message: 'User disabled', type: MessageType.Success };
	} catch (error: any) {
		return { message: error, type: MessageType.Error };
	}
};

export const demoteUser = async (uuid: string) => {
	try {
		const { error } = await request.post({
			url: `admin/user/${uuid}/demote`,
			headers: {
				authorization: `Bearer ${getToken()}`
			},
			options: {
				next: {
					tags: ['users']
				}
			}
		});

		if (error) return { message: error, type: MessageType.Error };

		revalidateTag('users');
		return { message: 'User demoted', type: MessageType.Success };
	} catch (error: any) {
		return { message: error, type: MessageType.Error };
	}
};

export const promoteUser = async (uuid: string) => {
	try {
		const { error } = await request.post({
			url: `admin/user/${uuid}/promote`,
			headers: {
				authorization: `Bearer ${getToken()}`
			},
			options: {
				next: {
					tags: ['users']
				}
			}
		});

		if (error) return { message: error, type: MessageType.Error };

		revalidateTag('users');
		return { message: 'User promoted', type: MessageType.Success };
	} catch (error: any) {
		return { message: error, type: MessageType.Error };
	}
};

export const purgeUser = async (uuid: string) => {
	try {
		const { error } = await request.post({
			url: `admin/user/${uuid}/purge`,
			headers: {
				authorization: `Bearer ${getToken()}`
			},
			options: {
				next: {
					tags: ['users']
				}
			}
		});

		if (error) return { message: error, type: MessageType.Error };

		revalidateTag('users');
		return { message: 'User purged', type: MessageType.Success };
	} catch (error: any) {
		return { message: error, type: MessageType.Error };
	}
};
