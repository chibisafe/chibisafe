export interface User {
	id: number;
	name: string;
	email: string;
	password: string;
	stravaLink: string;
}

export interface Segment {
	id: number;
	name: string;
	description: string;
	route: string;
	stravaLink: string;
	flagCount: number;
	removed: boolean;
	chunkyness: number;
	wayType: string;
	userId: number;
}

export interface Rating {
	id: number;
	rating: number;
	comment: string;
	segmentId: number;
}

export interface Picture {
	id: number;
	name: string;
	description?: string;
	path?: string;
	lat?: string;
	lng?: string;
	segmentId: number;
}
