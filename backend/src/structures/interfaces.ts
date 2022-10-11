import type { Request } from 'hyper-express';

import type { ChunksData } from '../utils/File';

export interface RequestUser {
	id: number;
	uuid: string;
	username: string;
	isAdmin: boolean;
	apiKey?: string | null | undefined;
}

export interface RequestWithUser extends Request {
	user: RequestUser;
}

// TODO
export interface RequestWithOptionalUser extends Request {
	user?: RequestUser;
}

export interface User {
	id: number;
	uuid: string;
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

export interface FileInProgress {
	name: string;
	extension: string;
	path: string;
	original: string;
	type: string;
	size: number;
	hash: string;
	ip: string;
	field?: string;
	chunksData?: ChunksData;
}

export interface File {
	id: number;
	uuid: string;
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
	uuid: string;
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
	chunkedUploadsTimeout: number;
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
	disableStatisticsCron: boolean;
	enabledStatistics: string[];
	// savedStatistics: string[];
	[key: string]: string[] | boolean | number | string;
}

export interface RouteOptions {
	url: string;
	method: string;
	options?: { [index: number | string]: any };
	middlewares?: (string | { [index: number | string]: any })[];
	debug?: boolean;
}

export interface UploadResult {
	uuid: string;
	name?: string;
	hash?: string;
	size?: number;
	url?: string;
	thumb?: string;
	deleteUrl?: string;
	repeated?: boolean;
}
