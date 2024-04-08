import type { PropsWithChildren } from 'react';

export default function MdxLayout({ children }: PropsWithChildren<{}>) {
	// Create any shared layout or styles here
	return <div>{children}</div>;
}
