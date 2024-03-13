'use server';

import { revalidateTag } from 'next/cache';
import { MessageType } from '@/types';

import request from '@/lib/request';
import { getToken } from './utils';

export const deleteAlbum = async (_: any, form: FormData) => {
	const uuid = form.get('uuid') as string;

	try {
		const { error } = await request.delete(
			`album/${uuid}`,
			{},
			{
				authorization: `Bearer ${getToken()}`
			}
		);

		if (error) return { message: error, type: MessageType.Error };

		revalidateTag('files');
		return { message: 'Album deleted', type: MessageType.Success };
	} catch (error: any) {
		return { message: error, type: MessageType.Error };
	}
};

export const deleteAlbumAndFiles = async (_: any, form: FormData) => {
	const uuid = form.get('uuid') as string;

	try {
		const { error } = await request.delete(
			`album/${uuid}/purge`,
			{},
			{
				authorization: `Bearer ${getToken()}`
			}
		);

		if (error) return { message: error, type: MessageType.Error };

		revalidateTag('files');
		return { message: 'Album and all files deleted', type: MessageType.Success };
	} catch (error: any) {
		return { message: error, type: MessageType.Error };
	}
};

export const deleteLink = async (_: any, form: FormData) => {
	const uuid = form.get('uuid') as string;
	const albumUuid = form.get('albumUuid') as string;

	try {
		const { error } = await request.delete(
			`album/${albumUuid}/link/${uuid}`,
			{},
			{
				authorization: `Bearer ${getToken()}`
			}
		);

		if (error) return { message: error, type: MessageType.Error };

		revalidateTag('links');
		return { message: 'Link deleted', type: MessageType.Success };
	} catch (error: any) {
		return { message: error, type: MessageType.Error };
	}
};

export const toggleEnabled = async (_: any, form: FormData) => {
	const uuid = form.get('uuid') as string;
	const albumUuid = form.get('albumUuid') as string;
	const enabled = form.get('enabled') === 'true';

	try {
		const { error } = await request.post(
			`album/${albumUuid}/link/${uuid}/edit`,
			{
				enabled: !enabled
			},
			{
				authorization: `Bearer ${getToken()}`
			}
		);

		if (error) return { message: error, type: MessageType.Error };

		return { message: `Link ${enabled ? 'disabled' : 'enabled'}`, type: MessageType.Success };
	} catch (error: any) {
		return { message: error, type: MessageType.Error };
	}
};

export const createAlbumLink = async (form: FormData) => {
	const uuid = form.get('uuid') as string;

	try {
		const { error } = await request.post(
			`album/${uuid}/link`,
			{},
			{
				authorization: `Bearer ${getToken()}`
			}
		);

		if (error) return { message: error, type: MessageType.Error };

		revalidateTag('links');
		return { message: 'Album link created', type: MessageType.Success };
	} catch (error: any) {
		return { message: error, type: MessageType.Error };
	}
};
