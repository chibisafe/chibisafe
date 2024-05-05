'use server';

import { revalidateTag } from 'next/cache';
import { MessageType } from '@/types';

import request from '@/lib/request';
import { getToken } from './utils';

export const deleteAlbum = async (uuid: string) => {
	try {
		const { error } = await request.delete({
			url: `album/${uuid}`,
			headers: {
				authorization: `Bearer ${getToken()}`
			}
		});

		if (error) return { message: error, type: MessageType.Error };

		revalidateTag('files');
		revalidateTag('albums');
		return { message: 'Album deleted', type: MessageType.Success };
	} catch (error: any) {
		return { message: error, type: MessageType.Error };
	}
};

export const deleteAlbumAndFiles = async (uuid: string) => {
	try {
		const { error } = await request.delete({
			url: `album/${uuid}/purge`,
			headers: {
				authorization: `Bearer ${getToken()}`
			}
		});

		if (error) return { message: error, type: MessageType.Error };

		revalidateTag('files');
		revalidateTag('albums');
		return { message: 'Album and all files deleted', type: MessageType.Success };
	} catch (error: any) {
		return { message: error, type: MessageType.Error };
	}
};

export const deleteLink = async (uuid: string, albumUuid: string) => {
	try {
		const { error } = await request.delete({
			url: `album/${albumUuid}/link/${uuid}`,
			headers: {
				authorization: `Bearer ${getToken()}`
			}
		});

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
		const { error } = await request.post({
			url: `album/${albumUuid}/link/${uuid}/edit`,
			body: {
				enabled: !enabled
			},
			headers: {
				authorization: `Bearer ${getToken()}`
			}
		});

		if (error) return { message: error, type: MessageType.Error };

		return { message: `Link ${enabled ? 'disabled' : 'enabled'}`, type: MessageType.Success };
	} catch (error: any) {
		return { message: error, type: MessageType.Error };
	}
};
