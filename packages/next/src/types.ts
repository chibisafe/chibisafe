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
	type: string;
	url: string;
	uuid: string;
};

export interface UploadFile {
	albumUuid: string | null;
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
	publicOnly?: boolean;
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

export interface FileWithIndex extends FileWithAdditionalData {
	index: number;
}

export interface Settings {
	backgroundImageURL: string;
	blockedExtensions: string[];
	chunkSize: number;
	logoURL: string;
	maxSize: number;
	metaDescription: string;
	metaDomain: string;
	metaKeywords: string;
	metaTwitterHandle: string;
	privacyPolicyPageContent: boolean;
	publicMode: boolean;
	rulesPageContent: boolean;
	serveUploadsFrom: string;
	serviceName: string;
	termsOfServicePageContent: boolean;
	useMinimalHomepage: boolean;
	useNetworkStorage: boolean;
	useUrlShortener: boolean;
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

export interface ApiUser {
	apiKey: string;
	createdAt: string;
	enabled?: string;
	id: number;
	passwordEditedAt?: Date;
	roles: {
		name: string;
	}[];
	storageQuota: {
		overQuota: boolean;
		quota: number;
		used: number;
	};
	username: string;
	uuid: string;
}

export interface UserWithCount extends ApiUser {
	_count: {
		files: number;
	};
	size: Number;
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

export interface BreadcrumbPage {
	name: string;
	url: string;
}

export interface TagWithCount extends Tag {
	_count: {
		files: number;
	};
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

export interface Link {
	createdAt: string;
	destination: string;
	identifier: string;
	link: string;
	user?: {
		username: string;
		uuid: string;
	};
	uuid: string;
	views: number;
}

export interface StorageQuota {
	overQuota: boolean;
	quota: number;
	used: number;
}

export interface UserWithCountAndQuota extends UserWithCount {
	storageQuota: StorageQuota;
}

export interface AlbumLink {
	albumUuid: string;
	createdAt: string;
	editedAt: string | null;
	enableDownload: boolean;
	enabled: boolean;
	expiresAt: string | null;
	identifier: string;
	uuid: string;
	views: number;
}

export interface Setting {
	category: string;
	description: string;
	example?: string;
	key: string;
	name: string;
	notice?: string;
	type: string;
	value: any;
}

export interface ReleaseNotes {
	body: string;
	name: string;
	url: string;
	version: string;
}

export interface UpdateCheck {
	latestVersion: string;
	latestVersionUrl: string;
	releaseNotes: ReleaseNotes[];
	updateAvailable: boolean;
}

export interface MetadataBuilder {
	description?: string;
	openGraph: {
		description?: string;
		images?: string[];
		title?: string;
	};
	title: string;
	twitter: {
		description?: string;
		images?: string[];
		title?: string;
	};
}
