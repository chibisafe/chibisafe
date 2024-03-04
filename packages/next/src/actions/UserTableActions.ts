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
