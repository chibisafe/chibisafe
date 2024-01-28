import { toast } from 'vue-sonner';

import request from '@/lib/request';
import { debug } from '@/lib/utils';

const sendErrorToast = (message: string) => {
	toast.error(message);
};

const sendSuccessToast = (message: string) => {
	toast.success(message);
};

export const changeApiKey = async () => {
	try {
		const data = await request.post('auth/apikey/change');
		debug('changeApiKey', data);
		return data;
	} catch (error: any) {
		sendErrorToast(error.message);
	}
};

export const getUsersAdmin = async () => {
	try {
		const data = await request.get(`admin/users`);
		debug('getUsersAdmin', data);
		return data;
	} catch (error: any) {
		sendErrorToast(error.message);
	}
};

export const getInvites = async () => {
	try {
		const data = await request.get(`admin/invites`);
		debug('getInvites', data);
		return data;
	} catch (error: any) {
		sendErrorToast(error.message);
	}
};

export const createInvite = async () => {
	try {
		const data = await request.post(`admin/invite/create`);
		debug('getInvites', data);
		if (data.message) sendSuccessToast(data.message);
		return data;
	} catch (error: any) {
		sendErrorToast(error.message);
	}
};

export const cancelInvite = async (code: string) => {
	try {
		const data = await request.post(`admin/invite/delete`, {
			code
		});
		debug('cancelInvite', data);
		if (data.message) sendSuccessToast(data.message);
		return data;
	} catch (error: any) {
		sendErrorToast(error.message);
	}
};

export const getUserAdmin = async (uuid: string) => {
	try {
		const data = await request.get(`admin/user/${uuid}`);
		debug('getUserAdmin', data);
		return data;
	} catch (error: any) {
		sendErrorToast(error.message);
	}
};

export const getFiles = async (page: number, limit = 50) => {
	try {
		const data = await request.get(`files?page=${page}&limit=${limit}`);
		debug('getFiles', data);
		return data;
	} catch (error: any) {
		sendErrorToast(error.message);
	}
};

export const getFilesAdmin = async (page: number, limit = 50, publicOnly = false, quarantine = false) => {
	try {
		const data = await request.get(
			`admin/files?page=${page}&limit=${limit}&publicOnly=${publicOnly}&quarantine=${quarantine}`
		);
		debug('getFilesAdmin', data);
		return data;
	} catch (error: any) {
		sendErrorToast(error.message);
	}
};

export const getFilesFromUser = async (uuid: string, page: number, limit = 50) => {
	try {
		const data = await request.get(`admin/user/${uuid}/files?page=${page}&limit=${limit}`);
		debug('getFilesFromUser', data);
		return data;
	} catch (error: any) {
		sendErrorToast(error.message);
	}
};

export const getFilesFromIP = async (ip: string, page: number, limit = 50) => {
	try {
		const data = await request.post(`admin/ip/files?page=${page}&limit=${limit}`, {
			ip
		});
		debug('getFilesFromIP', data);
		return data;
	} catch (error: any) {
		sendErrorToast(error.message);
	}
};

export const getFile = async (uuid: string) => {
	try {
		const data = await request.get(`file/${uuid}`);
		debug('getFile', data);
		return data.file;
	} catch (error: any) {
		sendErrorToast(error.message);
	}
};

export const deleteFile = async (uuid: string) => {
	try {
		const data = await request.delete(`file/${uuid}`);
		debug('deleteFile', data);
	} catch (error: any) {
		sendErrorToast(error.message);
	}
};

export const regenerateThumbnail = async (uuid: string) => {
	try {
		const data = await request.post(`file/${uuid}/thumbnail/regenerate`);
		debug('regenerateThumbnail', data);
	} catch (error: any) {
		sendErrorToast(error.message);
	}
};

export const deleteFileAsAdmin = async (uuid: string) => {
	try {
		const data = await request.delete(`admin/file/${uuid}`);
		debug('deleteFileAsAdmin', data);
	} catch (error: any) {
		sendErrorToast(error.message);
	}
};

export const quarantineFileAsAdmin = async (uuid: string) => {
	try {
		const data = await request.post(`admin/file/${uuid}/quarantine`);
		debug('quarantineFileAsAdmin', data);
	} catch (error: any) {
		sendErrorToast(error.message);
	}
};

export const allowFileAsAdmin = async (uuid: string) => {
	try {
		const data = await request.post(`admin/file/${uuid}/allow`);
		debug('allowFileAsAdmin', data);
	} catch (error: any) {
		sendErrorToast(error.message);
	}
};

export const getBannedIPs = async () => {
	try {
		const data = await request.get('admin/ip/list');
		debug('getBannedIPs', data);
		return data;
	} catch (error: any) {
		sendErrorToast(error.message);
	}
};

export const banIP = async (ip: string) => {
	try {
		const data = await request.post(`admin/ip/ban`, { ip });
		debug('banIP', data);
		if (data.message) sendSuccessToast(data.message);
	} catch (error: any) {
		sendErrorToast(error.message);
	}
};

export const unbanIP = async (ip: string) => {
	try {
		const data = await request.post(`admin/ip/unban`, { ip });
		debug('unbanIP', data);
		if (data.message) sendSuccessToast(data.message);
	} catch (error: any) {
		sendErrorToast(error.message);
	}
};

export const getAlbums = async () => {
	try {
		const data = await request.get('albums');
		debug('getAlbums', data);
		return data;
	} catch (error: any) {
		sendErrorToast(error.message);
	}
};

export const addFileToAlbum = async (fileUuid: string, albumUuid: string) => {
	try {
		const data = await request.post(`file/${fileUuid}/album/${albumUuid}`);
		debug('addFileToAlbum', data);
	} catch (error: any) {
		sendErrorToast(error.message);
	}
};

export const removeFileFromAlbum = async (fileUuid: string, albumUuid: string) => {
	try {
		const data = await request.delete(`file/${fileUuid}/album/${albumUuid}`);
		debug('removeFileFromAlbum', data);
	} catch (error: any) {
		sendErrorToast(error.message);
	}
};

export const createAlbum = async (name: string) => {
	try {
		const data = await request.post('album/create', { name });
		debug('createAlbum', data);
		toast.success('Album created');
	} catch (error: any) {
		sendErrorToast(error.message);
	}
};

export const updateAlbum = async (uuid: string, setting: any) => {
	try {
		const data = await request.post(`album/${uuid}/edit`, {
			[setting.name]: setting.value
		});
		debug('updateAlbum', data);
		return data;
	} catch (error: any) {
		sendErrorToast(error.message);
	}
};

export const getAlbum = async (uuid: string, page: number) => {
	try {
		const data = await request.get(`album/${uuid}?page=${page}`);
		debug('getAlbum', data);
		return data;
	} catch (error: any) {
		sendErrorToast(error.message);
	}
};

export const getAlbumLinks = async (uuid: string) => {
	try {
		const data = await request.get(`album/${uuid}/links`);
		debug('getAlbumLinks', data);
		return data;
	} catch (error: any) {
		sendErrorToast(error.message);
	}
};

export const createAlbumLink = async (uuid: string) => {
	try {
		const data = await request.post(`album/${uuid}/link`);
		debug('createAlbumLink', data);
		return data;
	} catch (error: any) {
		sendErrorToast(error.message);
	}
};

export const updateAlbumLink = async (uuid: string, linkUuid: string, setting: any) => {
	try {
		const data = await request.post(`album/${uuid}/link/${linkUuid}/edit`, {
			[setting.name]: setting.value
		});
		debug('updateAlbumLink', data);
		return data;
	} catch (error: any) {
		sendErrorToast(error.message);
	}
};

export const deleteAlbumLink = async (uuid: string, linkUuid: string) => {
	try {
		const data = await request.delete(`album/${uuid}/link/${linkUuid}`);
		debug('deleteAlbumLink', data);
	} catch (error: any) {
		sendErrorToast(error.message);
	}
};

export const deleteAlbum = async (uuid: string) => {
	try {
		const data = await request.delete(`album/${uuid}`);
		debug('deleteAlbum', data);
	} catch (error: any) {
		sendErrorToast(error.message);
	}
};

export const purgeUser = async (uuid: string) => {
	try {
		const data = await request.post(`admin/user/${uuid}/purge`);
		debug('purgeUser', data);
		if (data.message) sendSuccessToast(data.message);
	} catch (error: any) {
		sendErrorToast(error.message);
	}
};

export const purgeAnonymousFiles = async () => {
	try {
		const data = await request.post(`admin/files/purge/public`);
		debug('purgeAnonymousFiles', data);
		if (data.message) sendSuccessToast(data.message);
	} catch (error: any) {
		sendErrorToast(error.message);
	}
};

export const purgeFilesFromIP = async (ip: string) => {
	try {
		const data = await request.post(`admin/ip/files/purge`, { ip });
		debug('purgeFilesFromIP', data);
		if (data.message) sendSuccessToast(data.message);
	} catch (error: any) {
		sendErrorToast(error.message);
	}
};

export const disableUser = async (uuid: string) => {
	try {
		const data = await request.post(`admin/user/${uuid}/disable`);
		debug('disableUser', data);
		if (data.message) sendSuccessToast(data.message);
	} catch (error: any) {
		sendErrorToast(error.message);
	}
};

export const enableUser = async (uuid: string) => {
	try {
		const data = await request.post(`admin/user/${uuid}/enable`);
		debug('enableUser', data);
		if (data.message) sendSuccessToast(data.message);
	} catch (error: any) {
		sendErrorToast(error.message);
	}
};

export const promoteUser = async (uuid: string) => {
	try {
		const data = await request.post(`admin/user/${uuid}/promote`);
		debug('promoteUser', data);
		if (data.message) sendSuccessToast(data.message);
	} catch (error: any) {
		sendErrorToast(error.message);
	}
};

export const demoteUser = async (uuid: string) => {
	try {
		const data = await request.post(`admin/user/${uuid}/demote`);
		debug('demoteUser', data);
		if (data.message) sendSuccessToast(data.message);
	} catch (error: any) {
		sendErrorToast(error.message);
	}
};

export const purgeAlbum = async (uuid: string) => {
	try {
		const data = await request.delete(`album/${uuid}/purge`);
		debug('purgeAlbum', data);
	} catch (error: any) {
		sendErrorToast(error.message);
	}
};

export const getFilesFromPublicAlbum = async (identifier: string, page: number, limit = 50) => {
	try {
		const data = await request.get(`album/${identifier}/view?page=${page}&limit=${limit}`);
		debug('getFilesFromPublicAlbum', data);
		return data.album;
	} catch (error: any) {
		sendErrorToast(error.message);
	}
};

export const getStatistics = async (force: boolean = false) => {
	try {
		const data = await request.get(`admin/service/statistics${force ? '?force=true' : ''}`);
		debug(`getStatistics${force ? ' (forced)' : ''}`, data);
		return data.statistics;
	} catch (error: any) {
		sendErrorToast(error.message);
	}
};

export const checkForUpdate = async () => {
	try {
		const data = await request.get('admin/service/updateCheck');
		debug(`updateCheck`, data);
		return data;
	} catch (error: any) {
		sendErrorToast(error.message);
	}
};

export const getAdminSettings = async (_: boolean = false) => {
	try {
		const data = await request.get('admin/service/settings');
		debug('geAdminSettings', data);
		return data.settings;
	} catch (error: any) {
		sendErrorToast(error.message);
	}
};

export const setAdminSettings = async (settings: any) => {
	try {
		const data = await request.post('admin/service/settings', { settings });
		debug('setAdminSettings', data);
		if (data.message) sendSuccessToast(data.message);
		return data;
	} catch (error: any) {
		sendErrorToast(error.message);
	}
};

export const setUserStorageQuota = async (uuid: string, space: number) => {
	try {
		const data = await request.post(`admin/user/${uuid}/quota`, { space });
		debug('setUserStorageQuota', data);
		if (data.message) sendSuccessToast(data.message);
	} catch (error: any) {
		sendErrorToast(error.message);
	}
};

export const createTag = async (name: string) => {
	try {
		const data = await request.post('tag/create', { name });
		debug('createTag', data);
		toast.success('Tag created');
		return data.tag;
	} catch (error: any) {
		sendErrorToast(error.message);
	}
};

export const getTags = async () => {
	try {
		const data = await request.get(`tags`);
		debug('getTags', data);
		return data.tags;
	} catch (error: any) {
		sendErrorToast(error.message);
	}
};

export const deleteTag = async (uuid: string) => {
	try {
		const data = await request.delete(`tag/${uuid}`);
		debug('deleteTag', data);
		toast.success('Tag deleted');
	} catch (error: any) {
		sendErrorToast(error.message);
	}
};

export const getTag = async (uuid: string, page: number) => {
	try {
		const data = await request.get(`tag/${uuid}?page=${page}`);
		debug('getTag', data);
		return data;
	} catch (error: any) {
		sendErrorToast(error.message);
	}
};

export const searchFiles = async (text: string, page: number, limit = 50) => {
	try {
		const data = await request.post(`files/search?page=${page}&limit=${limit}`, { text });
		debug('searchFiles', data);
		return data;
	} catch (error: any) {
		sendErrorToast(error.message);
	}
};

export const createSnippet = async (name: string, content: string, language: string) => {
	try {
		const data = await request.post('snippet/create', { name, content, language });
		debug('createSnippet', data);
		if (data.message) sendSuccessToast(data.message);
		return data;
	} catch (error: any) {
		sendErrorToast(error.message);
	}
};

export const getSnippets = async () => {
	try {
		const data = await request.get('snippets');
		debug('getSnippets', data);
		return data.snippets;
	} catch (error: any) {
		sendErrorToast(error.message);
	}
};

export const getSnippet = async (uuid: string) => {
	try {
		const data = await request.get(`snippet/${uuid}`);
		debug('getSnippet', data);
		return data.snippet;
	} catch (error: any) {
		sendErrorToast(error.message);
	}
};

export const getPublicSnippet = async (identifier: string) => {
	try {
		const data = await request.get(`snippet/public/${identifier}`);
		debug('getPublicSnippet', data);
		return data.snippet;
	} catch (error: any) {
		sendErrorToast(error.message);
	}
};

export const deleteSnippet = async (uuid: string) => {
	try {
		const data = await request.delete(`snippet/${uuid}`);
		debug('deleteSnippet', data);
		if (data.message) sendSuccessToast(data.message);
	} catch (error: any) {
		sendErrorToast(error.message);
	}
};

export const addFileToTag = async (fileUuid: string, tagUuid: string) => {
	try {
		const data = await request.post(`file/${fileUuid}/tag/${tagUuid}`);
		debug('addFileToTag', data);
	} catch (error: any) {
		sendErrorToast(error.message);
	}
};

export const removeFileFromTag = async (fileUuid: string, tagUuid: string) => {
	try {
		const data = await request.delete(`file/${fileUuid}/tag/${tagUuid}`);
		debug('removeFileFromTag', data);
	} catch (error: any) {
		sendErrorToast(error.message);
	}
};
