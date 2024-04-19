import * as React from 'react';

import { highlighter } from '@/lib/shiki';

export async function CodeBlock({ code }: { readonly code: any }) {
	const multiLine = code.children.split('\n').length > 1;

	if (!multiLine) {
		return (
			<span className="relative rounded border px-[0.3rem] py-[0.2rem] font-mono text-sm">{code.children}</span>
		);
	}

	const lines = code.children.split('\n');
	if (lines[lines.length - 1] === '') {
		lines.pop();
	}

	return (
		<section
			className="mdx-code overflow-x-auto border border-accent rounded-lg py-4 mb-4 mt-6"
			// eslint-disable-next-line react/no-danger
			dangerouslySetInnerHTML={{
				// __html: highlightedCode
				__html: highlighter.codeToHtml(lines.join('\n'), {
					lang: code.className?.replace('language-', '') ?? 'plaintext',
					theme: 'github-dark-dimmed'
				})
			}}
		/>
	);
}
