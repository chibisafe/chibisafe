'use server';

import { MessageType } from '@/types';
import request from '@/lib/request';
import { getToken } from './utils';
import { revalidateTag } from 'next/cache';

export const regenerateThumbnails = async (uuids: string[]) => {
	try {
		const { error } = await request.post({
			url: 'files/thumbnail/regenerate',
			body: { files: uuids },
			headers: {
				authorization: `Bearer ${getToken()}`
			}
		});

		if (error) return { message: error, type: MessageType.Error };

		revalidateTag('files');
		return {
			message: `${uuids.length} ${uuids.length > 1 ? 'files' : 'file'} thumbnail${uuids.length > 1 ? 's' : ''} regenerated`,
			type: MessageType.Success
		};
	} catch (error: any) {
		return { message: error, type: MessageType.Error };
	}
};

export const deleteFiles = async (uuids: string[], type: string) => {
	try {
		const { error } = await request.post({
			url:
				type === 'admin' ? 'admin/files/delete' : type === 'quarantine' ? 'admin/files/delete' : 'files/delete',
			body: { files: uuids },
			headers: {
				authorization: `Bearer ${getToken()}`
			}
		});

		if (error) return { message: error, type: MessageType.Error };

		revalidateTag('files');
		return { message: `${uuids.length} ${uuids.length > 1 ? 'files' : 'file'} removed`, type: MessageType.Success };
	} catch (error: any) {
		return { message: error, type: MessageType.Error };
	}
};

export const quarantineFiles = async (uuids: string[]) => {
	try {
		const { error } = await request.post({
			url: 'admin/files/quarantine',
			body: { files: uuids },
			headers: {
				authorization: `Bearer ${getToken()}`
			}
		});

		if (error) return { message: error, type: MessageType.Error };

		revalidateTag('files');
		return {
			message: `${uuids.length} ${uuids.length > 1 ? 'files' : 'file'} quarantined`,
			type: MessageType.Success
		};
	} catch (error: any) {
		return { message: error, type: MessageType.Error };
	}
};

export const unquarantineFiles = async (uuids: string[]) => {
	try {
		const { error } = await request.post({
			url: 'admin/files/allow',
			body: { files: uuids },
			headers: {
				authorization: `Bearer ${getToken()}`
			}
		});

		if (error) return { message: error, type: MessageType.Error };

		revalidateTag('files');
		return { message: `${uuids.length} ${uuids.length > 1 ? 'files' : 'file'} allowed`, type: MessageType.Success };
	} catch (error: any) {
		return { message: error, type: MessageType.Error };
	}
};
