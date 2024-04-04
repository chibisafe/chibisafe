import { bundledLanguages, getHighlighter } from 'shiki';

export const highlighter = await getHighlighter({
	themes: ['github-dark-dimmed'],
	langs: Object.keys(bundledLanguages)
});
