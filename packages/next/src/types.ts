import type * as React from 'react';

export interface NavItem {
	disabled?: boolean;
	external?: boolean;
	href: string;
	icon?: string;
	title: string;
}

export interface NavigationProps {
	children?: React.ReactNode;
	items?: NavItem[];
}

export interface User {
	admin?: boolean;
	name: string;
}

export interface Role {
	name: string;
}

export interface LocalStorageUser {
	apiKey: string;
	roles: Role[];
	token: string;
	username: string;
	uuid: string;
}

export type FilePropsType = 'admin' | 'album' | 'publicAlbum' | 'quarantine' | 'tag' | 'uploads';
export type FileProps = {
	albumUuid?: string;
	identifier?: string;
	ip?: string;
	query?: PageQuery;
	tagUuid?: string;
	type: FilePropsType;
	userUuid?: string;
};

export type File = {
	createdAt: string;
	hash: string;
	ip: string;
	name: string;
	original: string;
	preview?: string;
	quarantine: boolean;
	size: number;
	thumb: string;
	thumbSquare: string;
	type: string;
	url: string;
	uuid: string;
};

export interface UploadFile {
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

export type PageQuery = {
	limit?: number;
	page?: number;
	search?: string;
};

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

export interface Settings {
	backgroundImageURL: string;
	blockedExtensions: string[];
	chunkSize: number;
	logoURL: string;
	maxSize: number;
	publicMode: boolean;
	serviceName: string;
	useNetworkStorage: boolean;
	userAccounts: boolean;
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

export const enum MessageType {
	Uninitialized = -1,
	Success,
	Error
}

export interface Tag {
	name: string;
	uuid: string;
}
