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
		return { file: data.file, albums: data.albums, tags: data.tags };
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
