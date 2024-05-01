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

// TODO: Implement these to be able to revalidate the albums and files tags server-side
// export const addFilesToAlbum = async (uuids: string[], albumUuid: string) => {
// 	try {
// 		const { error } = await request.post({
// 			url: `files/album/${albumUuid}`,
// 			body: { files: uuids },
// 			headers: {
// 				authorization: `Bearer ${getToken()}`
// 			}
// 		});

// 		if (error) return { message: error, type: MessageType.Error };

// 		revalidateTag('files');
// 		return {
// 			message: `${uuids.length} ${uuids.length > 1 ? 'files' : 'file'} added to album`,
// 			type: MessageType.Success
// 		};
// 	} catch (error: any) {
// 		return { message: error, type: MessageType.Error };
// 	}
// };

// export const removeFilesFromAlbum = async (uuids: string[], albumUuid: string) => {
// 	try {
// 		const { error } = await request.post({
// 			url: `files/album/${albumUuid}/delete`,
// 			body: { files: uuids },
// 			headers: {
// 				authorization: `Bearer ${getToken()}`
// 			}
// 		});

// 		if (error) return { message: error, type: MessageType.Error };

// 		revalidateTag('files');
// 		return {
// 			message: `${uuids.length} ${uuids.length > 1 ? 'files' : 'file'} removed from album`,
// 			type: MessageType.Success
// 		};
// 	} catch (error: any) {
// 		return { message: error, type: MessageType.Error };
// 	}
// };
