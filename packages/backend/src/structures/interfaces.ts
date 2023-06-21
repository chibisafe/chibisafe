import type { FastifyRequest } from 'fastify';

export interface RequestUser {
	id: number;
	uuid: string;
	username: string;
	isAdmin: boolean;
	apiKey?: string | null | undefined;
	passwordEditedAt: Date | null;
}

export interface RequestWithUser extends FastifyRequest {
	user: RequestUser;
}

export interface RequestWithOptionalUser extends FastifyRequest {
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
	size: string;
	hash: string;
	ip: string;
	field?: string;
}

export interface File {
	// id: number;
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

export interface FileWithId extends File {
	id: number;
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
	files?: File[];
	cover?: string;
	_count?: any;
}

export interface Settings {
	port: number;
	domain: string;
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
	blockNoExtension: boolean;
	publicMode: boolean;
	userAccounts: boolean;
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
	// options?: { [index: number | string]: any };
	options?: {
		rateLimit?: {
			max: number;
			timeWindow: number;
		};
		[index: number | string]: any;
	};
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
