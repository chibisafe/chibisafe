import type { PropsWithChildren } from 'react';

export default function MarketingLayout({ children }: PropsWithChildren) {
	return (
		<div className="flex min-h-screen flex-col">
			<main className="flex-1">{children}</main>
		</div>
	);
}
