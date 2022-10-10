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

export interface File {
	uuid: string;
	name: string;
	type: string;
	processing: boolean;
	status: string;
	bytesSent: number;
	bytesTotal: number;
	progress: number;
	url: string | undefined;
	error?: string;
}

export interface ApiError {
	message: string;
}
