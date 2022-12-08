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
	error?: string;
	url: string | undefined;
}

export interface FileWithAdditionalData extends File {
	original: string;
	thumb: string;
	ip: string;
	size: number;
	hash: string;
	createdAt: string;
	preview?: string;
}

export interface ApiError {
	message: string;
}

export interface Album {
	uuid: string;
	name: string;
	nsfw: boolean;
	zippedAt: string;
	createdAt: string;
	editedAt: string;
	cover?: string;
	count?: number;
}

export interface AlbumWithSelected extends Album {
	selected: boolean;
}
