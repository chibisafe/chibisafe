export interface User {
	loggedIn: boolean;
	username: string;
	uuid: string;
	isAdmin: boolean;
	apiKey: string;
	token: string;
	enabled?: string;
	createdAt?: string;
}

export interface UserWithCount extends User {
	_count: {
		files: number;
	};
	size: Number;
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
	user?: {
		uuid: string;
		username: string;
	};
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
	files?: FileWithAdditionalData[];
}

export interface AlbumForMasonry {
	uuid: string;
	name: string;
	isNsfw: boolean;
	count: number;
	files: FileWithAdditionalData[];
}

export interface AlbumLink {
	uuid: string;
	identifier: string;
	views: number;
	enabled: boolean;
	enableDownload: boolean;
	expiresAt: string;
}

export interface AlbumWithSelected extends Album {
	selected: boolean;
}

export interface Tag {
	uuid: string;
	name: string;
}
