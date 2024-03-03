'use server';

import { revalidateTag } from 'next/cache';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { MessageType } from '@/types';

import request from '@/lib/request';

export const regenerateThumbnail = async (uuid: string) => {
	const cookieStore = cookies();
	const token = cookieStore.get('token')?.value;
	if (!token) redirect('/');

	try {
		await request.post(
			`file/${uuid}/thumbnail/regenerate`,
			{},
			{
				authorization: `Bearer ${token}`
			}
		);

		revalidateTag('files');
		return {};
	} catch {
		return {};
	}
};

export const deleteFile = async (_: any, form: FormData) => {
	const cookieStore = cookies();
	const token = cookieStore.get('token')?.value;
	if (!token) redirect('/');

	const uuid = form.get('uuid') as string;

	try {
		await request.delete(
			`file/${uuid}`,
			{},
			{
				authorization: `Bearer ${token}`
			}
		);

		revalidateTag('files');
		return { message: 'File deleted', type: MessageType.Success };
	} catch (error: any) {
		return { message: error.message, type: MessageType.Error };
	}
};

export const quarantineFile = async (_: any, form: FormData) => {
	const cookieStore = cookies();
	const token = cookieStore.get('token')?.value;
	if (!token) redirect('/');

	const uuid = form.get('uuid') as string;

	try {
		await request.post(
			`admin/file/${uuid}/quarantine`,
			{},
			{
				authorization: `Bearer ${token}`
			}
		);

		revalidateTag('files');
		return { message: 'File quarantined', type: MessageType.Success };
	} catch (error: any) {
		return { message: error.message, type: MessageType.Error };
	}
};

export const allowFile = async (_: any, form: FormData) => {
	const cookieStore = cookies();
	const token = cookieStore.get('token')?.value;
	if (!token) redirect('/');

	const uuid = form.get('uuid') as string;

	try {
		await request.post(
			`admin/file/${uuid}/allow`,
			{},
			{
				authorization: `Bearer ${token}`
			}
		);

		revalidateTag('files');
		return { message: 'File allowed', type: MessageType.Success };
	} catch (error: any) {
		return { message: error.message, type: MessageType.Error };
	}
};
