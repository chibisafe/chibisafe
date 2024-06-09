'use server';

import { revalidateTag } from 'next/cache';
import { MessageType } from '@/types';
import { openAPIClient } from '@/lib/serverFetch';

export const enableUser = async (uuid: string) => {
	try {
		const { error } = await openAPIClient.PATCH('/api/v1/users/{uuid}/', {
			params: { path: { uuid } },
			body: {
				enabled: true
			}
		});

		if (error) return { message: error.message, type: MessageType.Error };

		revalidateTag('users');
		return { message: 'User enabled', type: MessageType.Success };
	} catch (error: any) {
		return { message: error, type: MessageType.Error };
	}
};

export const disableUser = async (uuid: string) => {
	try {
		const { error } = await openAPIClient.PATCH('/api/v1/users/{uuid}/', {
			params: { path: { uuid } },
			body: {
				enabled: false
			}
		});

		if (error) return { message: error.message, type: MessageType.Error };

		revalidateTag('users');
		return { message: 'User disabled', type: MessageType.Success };
	} catch (error: any) {
		return { message: error, type: MessageType.Error };
	}
};

export const purgeUser = async (uuid: string) => {
	try {
		const { error } = await openAPIClient.POST('/api/v1/users/{uuid}/purge/', {
			params: { path: { uuid } }
		});

		if (error) return { message: error.message, type: MessageType.Error };

		revalidateTag('users');
		return { message: 'User purged', type: MessageType.Success };
	} catch (error: any) {
		return { message: error, type: MessageType.Error };
	}
};
