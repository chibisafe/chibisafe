import type { PropsWithChildren } from 'react';

import { SiteFooter } from '@/components/Footer';
import { Header } from '@/components/Header';
import { GlobalDropZone } from '@/components/Dropzone';

export default async function MarketingLayout({ children }: PropsWithChildren) {
	return (
		<div className="flex min-h-screen flex-col">
			<Header />
			<main className="flex-1">{children}</main>
			<SiteFooter />
			<GlobalDropZone />
		</div>
	);
}
