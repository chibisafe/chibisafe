export interface User {
	loggedIn: boolean;
	username: string;
	uuid: string;
	isAdmin: boolean;
	apiKey: string;
	token: string;
}

export interface Toast {
	type: 'error' | 'success' | 'warning';
	message: string;
	id: number;
}
