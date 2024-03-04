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

export const setQuota = async (_: any, form: FormData) => {
	const uuid = form.get('uuid') as string;

	try {
		await request.post(
			`album/${uuid}`,
			{},
			{
				authorization: `Bearer ${getToken()}`
			}
		);

		revalidateTag('users');
		return { message: 'New quota set', type: MessageType.Success };
	} catch (error: any) {
		return { message: error.message, type: MessageType.Error };
	}
};

export const enableUser = async (_: any, form: FormData) => {
	const uuid = form.get('uuid') as string;

	try {
		await request.post(
			`admin/user/${uuid}/enable`,
			{},
			{
				authorization: `Bearer ${getToken()}`
			}
		);

		revalidateTag('users');
		return { message: 'User enabled', type: MessageType.Success };
	} catch (error: any) {
		return { message: error.message, type: MessageType.Error };
	}
};

export const disableUser = async (_: any, form: FormData) => {
	const uuid = form.get('uuid') as string;

	try {
		await request.post(
			`admin/user/${uuid}/disable`,
			{},
			{
				authorization: `Bearer ${getToken()}`
			}
		);

		revalidateTag('users');
		return { message: 'User disabled', type: MessageType.Success };
	} catch (error: any) {
		return { message: error.message, type: MessageType.Error };
	}
};

export const demoteUser = async (_: any, form: FormData) => {
	const uuid = form.get('uuid') as string;

	try {
		await request.post(
			`admin/user/${uuid}/demote`,
			{},
			{
				authorization: `Bearer ${getToken()}`
			}
		);

		revalidateTag('users');
		return { message: 'User demoted', type: MessageType.Success };
	} catch (error: any) {
		return { message: error.message, type: MessageType.Error };
	}
};

export const promoteUser = async (_: any, form: FormData) => {
	const uuid = form.get('uuid') as string;

	try {
		await request.post(
			`admin/user/${uuid}/promote`,
			{},
			{
				authorization: `Bearer ${getToken()}`
			}
		);

		revalidateTag('users');
		return { message: 'User promoted', type: MessageType.Success };
	} catch (error: any) {
		return { message: error.message, type: MessageType.Error };
	}
};

export const purgeUser = async (_: any, form: FormData) => {
	const uuid = form.get('uuid') as string;

	try {
		await request.post(
			`admin/user/${uuid}/purge`,
			{},
			{
				authorization: `Bearer ${getToken()}`
			}
		);

		revalidateTag('users');
		return { message: 'User purged', type: MessageType.Success };
	} catch (error: any) {
		return { message: error.message, type: MessageType.Error };
	}
};
