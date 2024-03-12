'use server';

import { revalidateTag } from 'next/cache';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { MessageType } from '@/types';

import request from '@/lib/request';

export const deleteAlbum = async (_: any, form: FormData) => {
	const cookieStore = cookies();
	const token = cookieStore.get('token')?.value;
	if (!token) redirect('/');

	const uuid = form.get('uuid') as string;

	try {
		await request.delete(
			`album/${uuid}`,
			{},
			{
				authorization: `Bearer ${token}`
			}
		);

		revalidateTag('files');
		return { message: 'Album deleted', type: MessageType.Success };
	} catch (error: any) {
		return { message: error.message, type: MessageType.Error };
	}
};

export const deleteAlbumAndFiles = async (_: any, form: FormData) => {
	const cookieStore = cookies();
	const token = cookieStore.get('token')?.value;
	if (!token) redirect('/');

	const uuid = form.get('uuid') as string;

	try {
		await request.delete(
			`album/${uuid}/purge`,
			{},
			{
				authorization: `Bearer ${token}`
			}
		);

		revalidateTag('files');
		return { message: 'Album and all files deleted', type: MessageType.Success };
	} catch (error: any) {
		return { message: error.message, type: MessageType.Error };
	}
};

export const deleteLink = async (_: any, form: FormData) => {
	const cookieStore = cookies();
	const token = cookieStore.get('token')?.value;
	if (!token) redirect('/');

	const uuid = form.get('uuid') as string;
	const albumUuid = form.get('albumUuid') as string;

	try {
		await request.delete(
			`album/${albumUuid}/link/${uuid}`,
			{},
			{
				authorization: `Bearer ${token}`
			}
		);

		revalidateTag('links');
		return { message: 'Link deleted', type: MessageType.Success };
	} catch (error: any) {
		return { message: error.message, type: MessageType.Error };
	}
};

export const toggleEnabled = async (_: any, form: FormData) => {
	const cookieStore = cookies();
	const token = cookieStore.get('token')?.value;
	if (!token) redirect('/');

	const uuid = form.get('uuid') as string;
	const albumUuid = form.get('albumUuid') as string;
	const enabled = form.get('enabled') === 'true';

	try {
		await request.post(
			`album/${albumUuid}/link/${uuid}/edit`,
			{
				enabled: !enabled
			},
			{
				authorization: `Bearer ${token}`
			}
		);

		return { message: `Link ${enabled ? 'enabled' : 'disabled'}`, type: MessageType.Success };
	} catch (error: any) {
		return { message: error.message, type: MessageType.Error };
	}
};

export const createAlbumLink = async (form: FormData) => {
	const cookieStore = cookies();
	const token = cookieStore.get('token')?.value;
	if (!token) redirect('/');

	const uuid = form.get('uuid') as string;

	try {
		await request.post(
			`album/${uuid}/link`,
			{},
			{
				authorization: `Bearer ${token}`
			}
		);

		revalidateTag('links');
		return { message: 'Album link created', type: MessageType.Success };
	} catch (error: any) {
		return { message: error.message, type: MessageType.Error };
	}
};
