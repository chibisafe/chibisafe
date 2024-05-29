import '@/styles/globals.css';

import type { PropsWithChildren } from 'react';
import type { Viewport } from 'next';
import { cookies } from 'next/headers';
import { Toaster } from 'sonner';

import { fontHeading, fontSans } from '@/lib/fonts';
import { cn } from '@/lib/utils';
import { SettingsProvider } from '@/components/providers/SettingsProvider';
import { TailwindIndicator } from '@/components/tailwind-indicator';
import { UserProvider } from '@/components/providers/UserProvider';

import { Providers } from './providers';
import { GlobalBackground } from '@/components/GlobalBackground';
import request from '@/lib/request';
import { GlobalAdminNotice } from '@/components/GlobalAdminNotice';

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

export async function generateMetadata() {
	const { data: settings, error } = await request.get({
		url: 'v1/settings',
		options: {
			next: {
				tags: ['settings']
			}
		}
	});

	if (error) {
		console.log(error);
	}

	return {
		metadataBase: new URL(settings?.siteUrl.value),
		title: {
			default: settings?.siteName.value,
			template: `%s - ${settings?.siteName.value}`
		},
		description: settings?.siteDescription.value,
		keywords: settings.siteKeywords.value,
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
			url: settings?.siteUrl.value,
			title: settings?.siteName.value,
			description: settings?.siteDescription.value,
			siteName: settings?.siteName.value,
			images: [`/og`]
		},
		twitter: {
			card: 'summary_large_image',
			title: settings?.siteName.value,
			description: settings?.siteDescription.value,
			images: [`/og`],
			creator: settings?.siteAuthor.value
		},
		icons: {
			icon: '/favicon.ico',
			shortcut: '/favicon-16x16.png',
			apple: '/apple-touch-icon.png'
		},
		manifest: `/site.webmanifest`
	};
}

export default function RootLayout({ children }: PropsWithChildren<{}>) {
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
					<GlobalAdminNotice />
					{children}
					<GlobalBackground />
					<Toaster position="bottom-center" />
					<TailwindIndicator />
					<UserProvider shouldFetch={hasTokenCookie} />
					<SettingsProvider />
				</Providers>
			</body>
		</html>
	);
}
