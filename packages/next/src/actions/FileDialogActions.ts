'use server';

import { MessageType } from '@/types';
import request from '@/lib/request';
import { getToken } from './utils';
import { revalidateTag } from 'next/cache';

export const regenerateThumbnail = async (uuid: string) => {
	try {
		await request.post({
			url: `file/${uuid}/thumbnail/regenerate`,
			headers: {
				authorization: `Bearer ${getToken()}`
			}
		});

		revalidateTag('files');

		return { message: 'Thumbnail queued for regeneration', type: MessageType.Success };
	} catch (error: any) {
		return { message: error, type: MessageType.Error };
	}
};

export const deleteFile = async (uuid: string) => {
	try {
		const { error } = await request.delete({
			url: `file/${uuid}`,
			headers: {
				authorization: `Bearer ${getToken()}`
			}
		});

		if (error) return { message: error, type: MessageType.Error };

		revalidateTag('files');

		return { message: 'File deleted', type: MessageType.Success };
	} catch (error: any) {
		return { message: error, type: MessageType.Error };
	}
};

export const deleteFileAsAdmin = async (uuid: string) => {
	try {
		const { error } = await request.delete({
			url: `admin/file/${uuid}`,
			headers: {
				authorization: `Bearer ${getToken()}`
			}
		});

		if (error) return { message: error, type: MessageType.Error };

		revalidateTag('files');

		return { message: 'File deleted', type: MessageType.Success };
	} catch (error: any) {
		return { message: error, type: MessageType.Error };
	}
};

export const quarantineFile = async (uuid: string) => {
	try {
		const { error } = await request.post({
			url: `admin/file/${uuid}/quarantine`,
			headers: {
				authorization: `Bearer ${getToken()}`
			}
		});

		if (error) return { message: error, type: MessageType.Error };

		revalidateTag('files');

		return { message: 'File quarantined', type: MessageType.Success };
	} catch (error: any) {
		return { message: error, type: MessageType.Error };
	}
};

export const allowFile = async (uuid: string) => {
	try {
		const { error } = await request.post({
			url: `admin/file/${uuid}/allow`,
			headers: {
				authorization: `Bearer ${getToken()}`
			}
		});

		if (error) return { message: error, type: MessageType.Error };

		revalidateTag('files');

		return { message: 'File allowed', type: MessageType.Success };
	} catch (error: any) {
		return { message: error, type: MessageType.Error };
	}
};
