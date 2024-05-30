'use server';

import { revalidateTag } from 'next/cache';
import { MessageType } from '@/types';

import { openAPIClient } from '@/lib/serverFetch';

export const deleteAlbum = async (uuid: string) => {
	try {
		const { error } = await openAPIClient.DELETE('/api/v1/folders/{uuid}/', {
			params: {
				path: {
					uuid
				}
			}
		});

		if (error) return { message: error.message, type: MessageType.Error };

		revalidateTag('files');
		revalidateTag('albums');
		return { message: 'Album deleted', type: MessageType.Success };
	} catch (error: any) {
		return { message: error, type: MessageType.Error };
	}
};

export const deleteAlbumAndFiles = async (uuid: string) => {
	// try {
	// 	const { error } = await request.delete({
	// 		url: `album/${uuid}/purge`,
	// 		headers: {
	// 			authorization: `Bearer ${getToken()}`
	// 		}
	// 	});
	// 	if (error) return { message: error, type: MessageType.Error };
	// 	revalidateTag('files');
	// 	revalidateTag('albums');
	// 	return { message: 'Album and all files deleted', type: MessageType.Success };
	// } catch (error: any) {
	// 	return { message: error, type: MessageType.Error };
	// }

	return { message: 'Not implemented yet', type: MessageType.Error };
};

export const deleteLink = async (shareUuid: string, albumUuid: string) => {
	try {
		console.log('deleteLink', shareUuid, albumUuid);
		const { error } = await openAPIClient.DELETE('/api/v1/folders/{uuid}/share/{shareUuid}', {
			params: {
				path: {
					uuid: albumUuid,
					shareUuid
				}
			}
		});

		if (error) return { message: error.message, type: MessageType.Error };

		revalidateTag('links');
		return { message: 'Link deleted', type: MessageType.Success };
	} catch (error: any) {
		return { message: error, type: MessageType.Error };
	}
};
