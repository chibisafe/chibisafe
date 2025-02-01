import type { PropsWithChildren } from 'react';

export default async function PublicAlbumsLayout({ children }: PropsWithChildren) {
	return <div className="flex min-h-screen">{children}</div>;
}
