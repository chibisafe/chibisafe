'use server';

import { revalidateTag } from 'next/cache';
import { MessageType } from '@/types';
import request from '@/lib/request';
import { getToken } from './utils';
import { openAPIClient } from '@/lib/serverFetch';

export const setQuota = async (_: any, form: FormData) => {
	// const uuid = form.get('uuid') as string;

	// try {
	// 	const { error } = await request.post({
	// 		url: `admin/user/${uuid}/quota`,
	// 		body: {
	// 			space: form.get('space')
	// 		},
	// 		headers: {
	// 			authorization: `Bearer ${getToken()}`
	// 		},
	// 		options: {
	// 			next: {
	// 				tags: ['users']
	// 			}
	// 		}
	// 	});

	// 	if (error) return { message: error, type: MessageType.Error };

	// 	revalidateTag('users');
	// 	return { message: 'New quota set', type: MessageType.Success };
	// } catch (error: any) {
	// 	return { message: error, type: MessageType.Error };
	// }
	return { message: 'Not implemented yet', type: MessageType.Error };
};

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

export const demoteUser = async (uuid: string) => {
	// try {
	// 	const { error } = await request.post({
	// 		url: `admin/user/${uuid}/demote`,
	// 		headers: {
	// 			authorization: `Bearer ${getToken()}`
	// 		},
	// 		options: {
	// 			next: {
	// 				tags: ['users']
	// 			}
	// 		}
	// 	});

	// 	if (error) return { message: error, type: MessageType.Error };

	// 	revalidateTag('users');
	// 	return { message: 'User demoted', type: MessageType.Success };
	// } catch (error: any) {
	// 	return { message: error, type: MessageType.Error };
	// }
	return { message: 'Not implemented yet', type: MessageType.Error };
};

export const promoteUser = async (uuid: string) => {
	// try {
	// 	const { error } = await request.post({
	// 		url: `admin/user/${uuid}/promote`,
	// 		headers: {
	// 			authorization: `Bearer ${getToken()}`
	// 		},
	// 		options: {
	// 			next: {
	// 				tags: ['users']
	// 			}
	// 		}
	// 	});

	// 	if (error) return { message: error, type: MessageType.Error };

	// 	revalidateTag('users');
	// 	return { message: 'User promoted', type: MessageType.Success };
	// } catch (error: any) {
	// 	return { message: error, type: MessageType.Error };
	// }
	return { message: 'Not implemented yet', type: MessageType.Error };
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
