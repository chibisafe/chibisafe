import type { FastifyRequest } from 'fastify';

export interface RequestUser {
	apiKey?: string | null | undefined;
	id: number;
	passwordEditedAt: Date | null;
	roles: {
		name: string;
	}[];
	username: string;
	uuid: string;
}

export interface RequestWithUser extends FastifyRequest {
	user: RequestUser;
}

export interface RequestWithOptionalUser extends FastifyRequest {
	user?: RequestUser;
}

export interface User {
	apiKey: string;
	apiKeyEditedAt: string;
	createdAt: string;
	editedAt: string;
	enabled: boolean;
	id: number;
	password: string;
	passwordEditedAt: string;
	roles: {
		name: string;
	}[];
	username: string;
	uuid: string;
}

export interface FileInProgress {
	extension: string;
	field?: string;
	hash: string;
	ip: string;
	isS3: boolean;
	isWatched: boolean;
	name: string;
	original: string;
	path: string;
	size: string;
	type: string;
}

export interface File {
	createdAt: Date;
	editedAt: Date | null;
	hash: string;
	ip: string;
	isS3: boolean;
	isWatched: boolean;
	name: string;
	original: string;
	quarantine: boolean;
	quarantineFile: {
		name: string;
	};
	size: number;
	type: string;
	userId?: number | null;
	// id: number;
	uuid: string;
}

export interface FileWithId extends File {
	id: number;
}

export interface ExtendedFile extends File {
	preview?: string;
	thumb?: string;
	thumbSquare?: string;
	url?: string;
}

export interface ExtendedFileWithData extends ExtendedFile {
	data: {
		filename: string;
		hash: string;
		mimeType: string;
		originalName: string;
		size: number;
	};
}

export interface Album {
	_count?: any;
	cover?: string;
	createdAt: Date;
	editedAt: Date | null;
	files?: File[];
	id: number;
	name: string;
	nsfw: boolean;
	userId: number;
	uuid: string;
	zippedAt: Date | null;
}

export interface Settings {
	// savedStatistics: string[];
	[key: string]: string[] | boolean | number | string;
	S3AccessKey: string;
	S3Bucket: string;
	S3Endpoint: string;
	S3PublicUrl: string;
	S3Region: string;
	S3SecretKey: string;
	backgroundImageURL: string;
	blockNoExtension: boolean;
	blockedExtensions: string[];
	chunkSize: number;
	chunkedUploadsTimeout: number;
	disableStatisticsCron: boolean;
	disableUpdateCheck: boolean;
	enableMixedCaseFilenames: boolean;
	enabledStatistics: string[];
	generateZips: boolean;
	generatedAlbumLength: number;
	generatedFilenameLength: number;
	logoURL: string;
	maxSize: number;
	metaDescription: string;
	metaDomain: string;
	metaKeywords: string;
	metaTwitterHandle: string;
	port: number;
	publicMode: boolean;
	rateLimitMax: number;
	rateLimitWindow: number;
	secret: string;
	serveUploadsFrom: string;
	serviceName: string;
	statisticsCron: string;
	updateCheckCron: string;
	useNetworkStorage: boolean;
	userAccounts: boolean;
	usersStorageQuota: number;
}

export interface RouteOptions {
	debug?: boolean;
	method: string;
	middlewares?: (string | { [index: number | string]: any })[];
	// options?: { [index: number | string]: any };
	options?: {
		[index: number | string]: any;
		rateLimit?: {
			max: number;
			timeWindow: number;
		};
	};
	schema?: any;
	url: string;
}

export interface UploadResult {
	deleteUrl?: string;
	hash?: string;
	name?: string;
	repeated?: boolean;
	size?: number;
	thumb?: string;
	url?: string;
	uuid: string;
}
