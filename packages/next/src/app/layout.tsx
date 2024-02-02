import '@/styles/globals.css';
import React from 'react';
import type { Metadata, Viewport } from 'next';
import { Toaster } from 'sonner';

import { siteConfig } from '@/config/site';
import { fontHeading, fontSans } from '@/lib/fonts';
import { cn } from '@/lib/utils';
import { TailwindIndicator } from '@/components/tailwind-indicator';
import { Providers } from './providers';
import { UserProvider } from '@/components/UserProvider';

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

export const metadata: Metadata = {
	metadataBase: new URL(siteConfig.url),
	title: {
		default: siteConfig.name,
		template: `%s - ${siteConfig.name}`
	},
	description: siteConfig.description,
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
		url: siteConfig.url,
		title: siteConfig.name,
		description: siteConfig.description,
		siteName: siteConfig.name,
		images: [`/meta.jpg`]
	},
	twitter: {
		card: 'summary_large_image',
		title: siteConfig.name,
		description: siteConfig.description,
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
					<UserProvider />
				</Providers>
			</body>
		</html>
	);
}
