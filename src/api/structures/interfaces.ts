import type { Request } from 'hyper-express';

export interface RequestWithUser extends Request {
	user: {
		id: number;
		username: string;
		isAdmin: boolean;
		apiKey?: string | null | undefined;
	};
}

export interface User {
	id: number;
	username: string;
	password: string;
	enabled: boolean;
	isAdmin: boolean;
	apiKey: string;
	passwordEditedAt: string;
	apiKeyEditedAt: string;
	createdAt: string;
	editedAt: string;
}

export interface File {
	id: number;
	userId?: number | null;
	name: string;
	original: string;
	type: string;
	size: number;
	hash: string;
	ip: string;
	createdAt: Date;
	editedAt: Date | null;
}

export interface ExtendedFile extends File {
	url?: string;
	thumb?: string;
	thumbSquare?: string;
	preview?: string;
}

export interface ExtendedFileWithData extends ExtendedFile {
	data: {
		hash: string;
		size: number;
		filename: string;
		originalName: string;
		mimeType: string;
	};
}

export interface Album {
	id: number;
	userId: number;
	name: string;
	zippedAt: Date | null;
	createdAt: Date;
	editedAt: Date | null;
	nsfw: boolean;
}

export interface Settings {
	domain: string;
	routePrefix: string;
	rateLimitWindow: number;
	rateLimitMax: number;
	secret: string;
	serviceName: string;
	chunkSize: number;
	maxSize: number;
	generateZips: boolean;
	generatedFilenameLength: number;
	generatedAlbumLength: number;
	blockedExtensions: string[];
	publicMode: boolean;
	userAccounts: boolean;
	metaThemeColor: string;
	metaDescription: string;
	metaKeywords: string;
	metaTwitterHandle: string;
	backgroundImageURL: string;
	logoURL: string;
	statisticsCron: string;
	enabledStatistics: string[];
	savedStatistics: string[];
	[key: string]: string | number | string[] | boolean;
}
