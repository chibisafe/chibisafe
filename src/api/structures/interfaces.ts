import type { FastifyRequest } from 'fastify';

export interface RequestWithUser extends FastifyRequest {
	user: {
		id: number;
		username: string;
		isAdmin: boolean;
		apiKey?: string;
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
	userId?: number;
	name: string;
	original: string;
	type: string;
	size: number;
	hash: string;
	ip: string;
	createdAt: string;
	editedAt: string;
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
	zippedAt: string;
	createdAt: string;
	editedAt: string;
	nsfw: boolean;
}
