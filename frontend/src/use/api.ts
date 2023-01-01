import { request } from './fetch';
import { useToastStore } from '~/store/toast';
let toastStore: ReturnType<typeof useToastStore>;

const sendErrorToast = (message: string) => {
	if (!toastStore) toastStore = useToastStore();
	toastStore.create('error', message);
};

export const login = async (username: string, password: string) => {
	try {
		const data = await request.post('auth/login', {
			username,
			password
		});

		console.log('login', data);
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

		console.log('register', data);
		return data;
	} catch (error: any) {
		sendErrorToast(error.message);
	}
};

export const getMe = async () => {
	try {
		const data = await request.get('verify');
		console.log('getMe', data);
		return data;
	} catch (error: any) {
		sendErrorToast(error.message);
	}
};

export const getFiles = async (page: number) => {
	try {
		const data = await request.get('files');
		console.log('getFiles', data);
		return { files: data.files, count: data.count };
	} catch (error: any) {
		sendErrorToast(error.message);
	}
};

export const getFile = async (uuid: string) => {
	try {
		const data = await request.get(`file/${uuid}`);
		console.log('getFile', data);
		return data.file;
	} catch (error: any) {
		sendErrorToast(error.message);
	}
};

export const deleteFile = async (uuid: string) => {
	try {
		const data = await request.delete(`file/${uuid}`);
		console.log('deleteFile', data);
	} catch (error: any) {
		sendErrorToast(error.message);
	}
};

export const getAlbums = async () => {
	try {
		const data = await request.get('albums');
		console.log('getAlbums', data);
		return data;
	} catch (error: any) {
		sendErrorToast(error.message);
	}
};

export const addFileToAlbum = async (fileUuid: string, albumUuid: string) => {
	try {
		const data = await request.post(`file/${fileUuid}/album/${albumUuid}`);
		console.log('addFileToAlbum', data);
	} catch (error: any) {
		sendErrorToast(error.message);
	}
};

export const removeFileFromAlbum = async (fileUuid: string, albumUuid: string) => {
	try {
		const data = await request.delete(`file/${fileUuid}/album/${albumUuid}`);
		console.log('removeFileFromAlbum', data);
	} catch (error: any) {
		sendErrorToast(error.message);
	}
};

export const createAlbum = async (name: string) => {
	try {
		const data = await request.post('album/create', { name });
		console.log('createAlbum', data);
	} catch (error: any) {
		sendErrorToast(error.message);
	}
};

export const getAlbum = async (uuid: string) => {
	try {
		const data = await request.get(`album/${uuid}`);
		console.log('getAlbum', data);
		return data;
	} catch (error: any) {
		sendErrorToast(error.message);
	}
};

export const getAlbumLinks = async (uuid: string) => {
	try {
		const data = await request.get(`album/${uuid}/links`);
		console.log('getAlbumLinks', data);
		return data;
	} catch (error: any) {
		sendErrorToast(error.message);
	}
};

export const createAlbumLink = async (uuid: string) => {
	try {
		const data = await request.post(`album/${uuid}/link`);
		console.log('createAlbumLink', data);
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
		console.log('updateAlbumLink', data);
		return data;
	} catch (error: any) {
		sendErrorToast(error.message);
	}
};

export const deleteAlbumLink = async (uuid: string, linkUuid: string) => {
	try {
		const data = await request.delete(`album/${uuid}/link/${linkUuid}`);
		console.log('deleteAlbumLink', data);
	} catch (error: any) {
		sendErrorToast(error.message);
	}
};

export const getFilesFromPublicAlbum = async (identifier: string) => {
	try {
		const data = await request.get(`album/${identifier}/view`);
		console.log('getFilesFromPublicAlbum', data);
		return { name: data.name, files: data.files, count: data.filesCount, isNsfw: data.isNsfw };
	} catch (error: any) {
		sendErrorToast(error.message);
	}
};
