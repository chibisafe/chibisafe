import '@/styles/globals.css';
import React from 'react';
import type { Metadata, Viewport } from 'next';
import { cookies } from 'next/headers';
import { Toaster } from 'sonner';

import { fontHeading, fontSans } from '@/lib/fonts';
import { cn } from '@/lib/utils';
import { SettingsProvider } from '@/components/SettingsProvider';
import { UserProvider } from '@/components/UserProvider';
import { TailwindIndicator } from '@/components/tailwind-indicator';

import { Providers } from './providers';

export const viewport: Viewport = {
	width: 'device-width',
	initialScale: 1,
	minimumScale: 1,
	maximumScale: 1,
	themeColor: [
		{ media: '(prefers-color-scheme: light)', color: 'black' },
		{ media: '(prefers-color-scheme: dark)', color: 'black' }
	]
};

const meta = {
	url: 'https://chibisafe.moe',
	name: 'chibisafe',
	description: 'Beautiful and performant vault to save all your files in the cloud.'
};

export const metadata: Metadata = {
	metadataBase: new URL(meta.url),
	title: {
		default: meta.name,
		template: `%s - ${meta.name}`
	},
	description: meta.description,
	keywords: ['chibisafe', 'file uploader', 'vault', 'react', 'free', 'open source', 'pitu', 'kana', 'kana.dev'],
	authors: [
		{
			name: 'Pitu',
			url: 'https://kana.dev'
		}
	],
	creator: 'Pitu',

	openGraph: {
		type: 'website',
		locale: 'en_US',
		url: meta.url,
		title: meta.name,
		description: meta.description,
		siteName: meta.name,
		images: [`/meta.jpg`]
	},
	twitter: {
		card: 'summary_large_image',
		title: meta.name,
		description: meta.description,
		images: [`/meta.jpg`],
		creator: '@its_pitu'
	},
	icons: {
		icon: '/favicon.ico',
		shortcut: '/favicon-16x16.png',
		apple: '/apple-touch-icon.png'
	},
	manifest: `/site.webmanifest`
};

interface RootLayoutProps {
	readonly children: React.ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
	const hasTokenCookie = cookies().has('token');
	return (
		<html lang="en" suppressHydrationWarning>
			<head />
			<body
				className={cn(
					'min-h-screen bg-background font-sans antialiased',
					fontSans.variable,
					fontHeading.variable
				)}
			>
				<Providers>
					{children}
					<Toaster />
					<TailwindIndicator />
					<UserProvider shouldFetch={hasTokenCookie} />
					<SettingsProvider />
				</Providers>
			</body>
		</html>
	);
}
