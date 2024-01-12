import type { MDXComponents } from 'mdx/types';

// TODO: Implement these when needed https://github.com/adam-p/markdown-here/wiki/Markdown-Cheatsheet

export function useMDXComponents(components: MDXComponents): MDXComponents {
	return {
		wrapper: ({ children }) => <div className="container max-w-3xl py-6 lg:py-12">{children}</div>,
		h1: ({ children }) => <h1 className="inline-block font-heading text-4xl lg:text-5xl">{children}</h1>,
		h2: ({ children }) => (
			<h2 className="mt-10 scroll-m-20 border-b pb-1 text-3xl font-semibold tracking-tight first:mt-0">
				{children}
			</h2>
		),
		h6: ({ children }) => <h6 className="text-xl text-muted-foreground">{children}</h6>,
		p: ({ children }) => <p className="leading-7 [&:not(:first-child)]:mt-6">{children}</p>,
		...components
	};
}
