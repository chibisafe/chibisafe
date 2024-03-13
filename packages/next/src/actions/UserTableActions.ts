'use server';

import { revalidateTag } from 'next/cache';
import { MessageType } from '@/types';
import request from '@/lib/request';
import { getToken } from './utils';

export const setQuota = async (_: any, form: FormData) => {
	const uuid = form.get('uuid') as string;

	try {
		const { error } = await request.post(
			`admin/user/${uuid}/quota`,
			{
				space: form.get('space')
			},
			{
				authorization: `Bearer ${getToken()}`
			}
		);

		if (error) return { message: error, type: MessageType.Error };

		revalidateTag('users');
		return { message: 'New quota set', type: MessageType.Success };
	} catch (error: any) {
		return { message: error, type: MessageType.Error };
	}
};

export const enableUser = async (_: any, form: FormData) => {
	const uuid = form.get('uuid') as string;

	try {
		const { error } = await request.post(
			`admin/user/${uuid}/enable`,
			{},
			{
				authorization: `Bearer ${getToken()}`
			}
		);

		if (error) return { message: error, type: MessageType.Error };

		revalidateTag('users');
		return { message: 'User enabled', type: MessageType.Success };
	} catch (error: any) {
		return { message: error, type: MessageType.Error };
	}
};

export const disableUser = async (_: any, form: FormData) => {
	const uuid = form.get('uuid') as string;

	try {
		const { error } = await request.post(
			`admin/user/${uuid}/disable`,
			{},
			{
				authorization: `Bearer ${getToken()}`
			}
		);

		if (error) return { message: error, type: MessageType.Error };

		revalidateTag('users');
		return { message: 'User disabled', type: MessageType.Success };
	} catch (error: any) {
		return { message: error, type: MessageType.Error };
	}
};

export const demoteUser = async (_: any, form: FormData) => {
	const uuid = form.get('uuid') as string;

	try {
		const { error } = await request.post(
			`admin/user/${uuid}/demote`,
			{},
			{
				authorization: `Bearer ${getToken()}`
			}
		);

		if (error) return { message: error, type: MessageType.Error };

		revalidateTag('users');
		return { message: 'User demoted', type: MessageType.Success };
	} catch (error: any) {
		return { message: error, type: MessageType.Error };
	}
};

export const promoteUser = async (_: any, form: FormData) => {
	const uuid = form.get('uuid') as string;

	try {
		const { error } = await request.post(
			`admin/user/${uuid}/promote`,
			{},
			{
				authorization: `Bearer ${getToken()}`
			}
		);

		if (error) return { message: error, type: MessageType.Error };

		revalidateTag('users');
		return { message: 'User promoted', type: MessageType.Success };
	} catch (error: any) {
		return { message: error, type: MessageType.Error };
	}
};

export const purgeUser = async (_: any, form: FormData) => {
	const uuid = form.get('uuid') as string;

	try {
		const { error } = await request.post(
			`admin/user/${uuid}/purge`,
			{},
			{
				authorization: `Bearer ${getToken()}`
			}
		);

		if (error) return { message: error, type: MessageType.Error };

		revalidateTag('users');
		return { message: 'User purged', type: MessageType.Success };
	} catch (error: any) {
		return { message: error, type: MessageType.Error };
	}
};
