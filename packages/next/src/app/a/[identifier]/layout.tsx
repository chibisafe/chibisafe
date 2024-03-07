import type { PropsWithChildren } from 'react';

import { SiteFooter } from '@/components/Footer';

export default async function PublicAlbumsLayout({ children }: PropsWithChildren) {
	return (
		<div className="flex min-h-screen flex-col">
			<div className="container flex flex-grow flex-col py-8 gap-6">{children}</div>
			<SiteFooter className="border-t" />
		</div>
	);
}
