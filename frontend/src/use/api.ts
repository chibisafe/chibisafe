import { request } from './fetch';

export const login = async (username: string, password: string) => {
	const data = await request.post('auth/login', {
		username,
		password
	});

	console.log('login', data);
	return data;
};

export const register = async (username: string, password: string) => {
	const data = await request.post('auth/register', {
		username,
		password
	});

	console.log('register', data);
	return data;
};

export const getMe = async () => {
	const data = await request.get('verify');
	console.log('getMe', data);
	return data;
};
