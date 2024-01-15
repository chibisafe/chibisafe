export interface User {
	apiKey: string;
	createdAt?: string;
	enabled?: string;
	id: number;
	loggedIn: boolean;
	passwordEditedAt?: Date;
	roles: {
		name: string;
	}[];
	storageQuota: {
		overQuota: boolean;
		quota: number;
		used: number;
	};
	token: string;
	username: string;
	uuid: string;
}

export interface UserWithCount extends User {
	_count: {
		files: number;
	};
	size: Number;
}

export interface Toast {
	id: number;
	message: string;
	type: 'error' | 'success' | 'warning';
}

export interface File {
	bytesSent: number;
	bytesTotal: number;
	error?: string;
	name: string;
	processing: boolean;
	progress: number;
	status: string;
	type: string;
	url: string | undefined;
	uuid: string;
}

export interface FileWithAdditionalData extends File {
	createdAt: string;
	hash: string;
	ip: string;
	original: string;
	preview?: string;
	quarantine: boolean;
	size: number;
	thumb: string;
	user?: {
		createdAt: number;
		enabled: boolean;
		roles: {
			name: string;
		}[];
		username: string;
		uuid: string;
	};
}

export interface ApiError {
	message: string;
}

export interface Album {
	count?: number;
	cover?: string;
	createdAt: string;
	description: string;
	editedAt: string;
	files?: FileWithAdditionalData[];
	name: string;
	nsfw: boolean;
	uuid: string;
	zippedAt: string;
}

export interface AlbumForMasonry {
	count: number;
	description: string;
	files: FileWithAdditionalData[];
	isNsfw: boolean;
	name: string;
	uuid: string;
}

export interface AlbumLink {
	enableDownload: boolean;
	enabled: boolean;
	expiresAt: string;
	identifier: string;
	uuid: string;
	views: number;
}

export interface AlbumWithSelected extends Album {
	selected: boolean;
}

export interface Tag {
	name: string;
	uuid: string;
}

export interface Invite {
	code: string;
	createdAt: string;
	createdBy: {
		username: string;
		uuid: string;
	};
	editedAt: string;
	used: boolean;
	usedBy: {
		username: string;
		uuid: string;
	};
}

export interface UpdateCheck {
	latestVersion: string;
	latestVersionUrl: string;
	releaseNotes: {
		body: string;
		name: string;
		url: string;
		version: string;
	}[];
	updateAvailable: boolean;
}

export interface Snippet {
	content: string;
	createdAt: string;
	description: string;
	language: string;
	link: string;
	name: string;
	parentUuid: string;
	raw: string;
	uuid: string;
}

export type FilePropsType = 'admin' | 'album' | 'publicAlbum' | 'quarantine' | 'tag' | 'uploads';

export interface Setting {
	category: string;
	description: string;
	example?: string;
	key: string;
	name: string;
	notice?: string;
	type: string;
	value: boolean | number | string;
}
