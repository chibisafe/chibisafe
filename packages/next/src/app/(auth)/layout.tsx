import type { PropsWithChildren } from 'react';

export default function AuthLayout({ children }: PropsWithChildren) {
	return <div className="min-h-screen">{children}</div>;
}
