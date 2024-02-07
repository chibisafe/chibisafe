'use client';

import type { PropsWithChildren } from 'react';
import { Provider as JotaiProvider } from 'jotai';
import { ThemeProvider } from 'next-themes';

export function Providers({ children }: PropsWithChildren) {
	return (
		<JotaiProvider>
			<ThemeProvider attribute="class" defaultTheme="system" enableSystem>
				{children}
			</ThemeProvider>
		</JotaiProvider>
	);
}
