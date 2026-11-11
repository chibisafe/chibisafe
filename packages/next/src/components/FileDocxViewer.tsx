import { useEffect, useRef } from 'react';

export const FileDocxViewer = ({ url }: { readonly url: string }) => {
	const container = useRef<HTMLDivElement>(null);

	useEffect(() => {
		let cancelled = false;

		void (async () => {
			const [{ renderAsync }, response] = await Promise.all([import('docx-preview'), fetch(url)]);
			if (!cancelled && container.current) {
				await renderAsync(await response.blob(), container.current);
			}
		})();

		return () => {
			cancelled = true;
		};
	}, [url]);

	return <div ref={container} className="h-full w-[calc(100vw-8rem)] max-w-5xl overflow-auto bg-background" />;
};
