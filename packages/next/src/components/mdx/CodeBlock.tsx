import * as React from 'react';

import { highlighter } from '@/lib/shiki';

export async function CodeBlock({ code }: { readonly code: any }) {
	// const highlightedCode = await highlightCode(code);
	// check if children has more than 1 line
	const multiLine = code.children.split('\n').length > 1;

	if (!multiLine) {
		return (
			<span className="relative rounded border px-[0.3rem] py-[0.2rem] font-mono text-sm">{code.children}</span>
		);
	}

	return (
		<section
			className="overflow-x-auto border border-accent rounded-lg py-4 mb-4 mt-6"
			// eslint-disable-next-line react/no-danger
			dangerouslySetInnerHTML={{
				// __html: highlightedCode
				__html: highlighter.codeToHtml(code.children, {
					lang: code.className?.replace('language-', '') ?? 'plaintext',
					theme: 'github-dark-dimmed'
				})
			}}
		/>
	);
}
