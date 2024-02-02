'use client';

import type { PropsWithChildren } from "react";
import { ThemeProvider } from "next-themes"
import { Provider as JotaiProvider } from "jotai";

export function Providers({ children } : PropsWithChildren) {
	return (
		<JotaiProvider>
			<ThemeProvider attribute="class" defaultTheme="system" enableSystem>
				{children}
			</ThemeProvider>
		</JotaiProvider>
	);
} 
