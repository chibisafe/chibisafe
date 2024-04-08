import type { PropsWithChildren } from 'react';

export default function GuidesLayout({ children }: PropsWithChildren<{}>) {
	return <div className="mx-auto max-w-5xl mt-8">{children}</div>;
}
