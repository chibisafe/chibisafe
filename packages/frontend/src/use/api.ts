import { request } from './fetch';
import { useToastStore } from '~/store/toast';
import { debug } from '~/use/log';
let toastStore: ReturnType<typeof useToastStore>;

const sendErrorToast = (message: string) => {
	if (!toastStore) toastStore = useToastStore();
	toastStore.create('error', message);
};

const sendSuccessToast = (message: string) => {
	if (!toastStore) toastStore = useToastStore();
	toastStore.create('success', message);
};

export const login = async (username: string, password: string) => {
	try {
		const data = await request.post('auth/login', {
			username,
			password
		});

		debug('login', data);
		return data;
	} catch (error: any) {
		sendErrorToast(error.message);
	}
};

export const register = async (username: string, password: string, invite?: string) => {
	try {
		const data = await request.post(
			'auth/register',
			{
				username,
				password
			},
			invite
				? {
						invite
				  }
				: undefined
		);

		debug('register', data);
		return data;
	} catch (error: any) {
		sendErrorToast(error.message);
	}
};

export const changePassword = async (password: string, newPassword: string) => {
	try {
		const data = await request.post('auth/password/change', {
			password,
			newPassword
		});
		debug('changePassword', data);
		return data;
	} catch (error: any) {
		sendErrorToast(error.message);
	}
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

export const getSettings = async () => {
	try {
		const data = await request.get('settings');
		debug('getSettings', data);
		return data;
	} catch (error: any) {
		sendErrorToast(error.message);
	}
};

export const getMe = async () => {
	try {
		const data = await request.get('verify');
		debug('getMe', data);
		return data;
	} catch (error: any) {
		sendErrorToast(error.message);
	}
};

export const getUsersAdmin = async () => {
	try {
		const data = await request.get(`admin/users`);
		debug('getUsersAdmin', data);
		return { users: data.users };
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
		return { user: data.user };
	} catch (error: any) {
		sendErrorToast(error.message);
	}
};

export const getFiles = async (page: number) => {
	try {
		const data = await request.get(`files?page=${page}`);
		debug('getFiles', data);
		return { files: data.files, count: data.count };
	} catch (error: any) {
		sendErrorToast(error.message);
	}
};

export const getFilesAdmin = async (page: number, publicOnly = false) => {
	try {
		const data = await request.get(`admin/files?page=${page}&publicOnly=${publicOnly}`);
		debug('getFilesAdmin', data);
		return { files: data.files, count: data.count };
	} catch (error: any) {
		sendErrorToast(error.message);
	}
};

export const getFilesFromUser = async (uuid: string, page: number) => {
	try {
		const data = await request.get(`admin/user/${uuid}/files?page=${page}`);
		debug('getFilesFromUser', data);
		return { user: data.user, files: data.files, count: data.count };
	} catch (error: any) {
		sendErrorToast(error.message);
	}
};

export const getFilesFromIP = async (ip: string, page: number) => {
	try {
		const data = await request.post(`admin/ip/files?page=${page}`, {
			ip
		});
		debug('getFilesFromIP', data);
		return { files: data.files, count: data.count, banned: data.banned };
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

export const deleteFileAsAdmin = async (uuid: string) => {
	try {
		const data = await request.delete(`admin/file/${uuid}`);
		debug('deleteFileAsAdmin', data);
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

export const getFilesFromPublicAlbum = async (identifier: string) => {
	try {
		const data = await request.get(`album/${identifier}/view`);
		debug('getFilesFromPublicAlbum', data);
		return { name: data.name, files: data.files, count: data.filesCount, isNsfw: data.isNsfw };
	} catch (error: any) {
		sendErrorToast(error.message);
	}
};

export const getStatistics = async (force: boolean = false) => {
	try {
		const data = await request.get(`admin/service/statistics/${force ? 'force' : ''}`);
		debug(`getStatistics${force ? ' (forced)' : ''}`, data);
		return data.statistics;
	} catch (error: any) {
		sendErrorToast(error.message);
	}
};

export const getAdminSettings = async (force: boolean = false) => {
	try {
		const data = await request.get('admin/service/settings');
		debug('geAdminSettings', data);
		return data;
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

export const createTag = async (name: string) => {
	try {
		const data = await request.post('tag/create', { name });
		debug('createTag', data);
		return {
			message: data.message,
			tag: {
				uuid: data.uuid,
				name: data.name
			}
		};
	} catch (error: any) {
		sendErrorToast(error.message);
	}
};

export const getTags = async () => {
	try {
		const data = await request.get(`tags`);
		debug('getTags', data);
		return data;
	} catch (error: any) {
		sendErrorToast(error.message);
	}
};

export const searchFiles = async (text: string, page: number) => {
	try {
		const data = await request.post(`files/search?page=${page}`, { text });
		debug('searchFiles', data);
		return data;
	} catch (error: any) {
		sendErrorToast(error.message);
	}
};
