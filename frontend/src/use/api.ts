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

export const register = async (username: string, password: string) => {
	try {
		const data = await request.post('auth/register', {
			username,
			password
		});

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

export const getFiles = async () => {
	try {
		const data = await request.get('files');
		console.log('getFiles', data);
		return data;
	} catch (error: any) {
		sendErrorToast(error.message);
	}
};
