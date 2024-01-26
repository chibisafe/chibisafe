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
