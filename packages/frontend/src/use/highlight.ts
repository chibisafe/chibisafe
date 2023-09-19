import hljs from 'highlight.js/lib/core';
import apache from 'highlight.js/lib/languages/apache';
import bash from 'highlight.js/lib/languages/bash';
import css from 'highlight.js/lib/languages/css';
import diff from 'highlight.js/lib/languages/diff';
import dockerfile from 'highlight.js/lib/languages/dockerfile';
import go from 'highlight.js/lib/languages/go';
import ini from 'highlight.js/lib/languages/ini';
import java from 'highlight.js/lib/languages/java';
import javascript from 'highlight.js/lib/languages/javascript';
import json from 'highlight.js/lib/languages/json';
import markdown from 'highlight.js/lib/languages/markdown';
import nginx from 'highlight.js/lib/languages/nginx';
import php from 'highlight.js/lib/languages/php';
import plaintext from 'highlight.js/lib/languages/plaintext';
import python from 'highlight.js/lib/languages/python';
import ruby from 'highlight.js/lib/languages/ruby';
import scss from 'highlight.js/lib/languages/scss';
import sql from 'highlight.js/lib/languages/sql';
import typescript from 'highlight.js/lib/languages/typescript';
import xml from 'highlight.js/lib/languages/xml';
import yaml from 'highlight.js/lib/languages/yaml';

hljs.registerLanguage('apache', apache);
hljs.registerLanguage('bash', bash);
hljs.registerLanguage('css', css);
hljs.registerLanguage('diff', diff);
hljs.registerLanguage('dockerfile', dockerfile);
hljs.registerLanguage('go', go);
hljs.registerLanguage('ini', ini);
hljs.registerLanguage('java', java);
hljs.registerLanguage('javascript', javascript);
hljs.registerLanguage('json', json);
hljs.registerLanguage('markdown', markdown);
hljs.registerLanguage('nginx', nginx);
hljs.registerLanguage('php', php);
hljs.registerLanguage('plaintext', plaintext);
hljs.registerLanguage('python', python);
hljs.registerLanguage('ruby', ruby);
hljs.registerLanguage('scss', scss);
hljs.registerLanguage('sql', sql);
hljs.registerLanguage('typescript', typescript);
hljs.registerLanguage('xml', xml);
hljs.registerLanguage('yaml', yaml);

export const supportedLanguages = [
	{
		name: 'Plain Text',
		value: 'plaintext',
		extension: ['txt']
	},
	{
		name: 'Apache',
		value: 'apache',
		extension: ['conf', 'htaccess']
	},
	{
		name: 'Bash',
		value: 'bash',
		extension: ['sh', 'zsh']
	},
	{
		name: 'CSS',
		value: 'css',
		extension: ['css']
	},
	{
		name: 'Dockerfile',
		value: 'dockerfile',
		extension: ['dockerfile']
	},
	{
		name: 'Go',
		value: 'go',
		extension: ['go']
	},
	{
		name: 'HTML',
		value: 'xml',
		extension: ['html', 'htm']
	},
	{
		name: 'Ini',
		value: 'ini',
		extension: ['ini']
	},
	{
		name: 'Java',
		value: 'java',
		extension: ['java']
	},
	{
		name: 'JavaScript',
		value: 'javascript',
		extension: ['js']
	},
	{
		name: 'JSON',
		value: 'json',
		extension: ['json']
	},
	{
		name: 'Markdown',
		value: 'markdown',
		extension: ['md']
	},
	{
		name: 'Nginx',
		value: 'nginx',
		extension: ['conf']
	},
	{
		name: 'PHP',
		value: 'php',
		extension: ['php']
	},
	{
		name: 'Python',
		value: 'python',
		extension: ['py']
	},
	{
		name: 'Ruby',
		value: 'ruby',
		extension: ['rb']
	},
	{
		name: 'SCSS',
		value: 'scss',
		extension: ['scss']
	},
	{
		name: 'SQL',
		value: 'sql',
		extension: ['sql']
	},
	{
		name: 'TypeScript',
		value: 'typescript',
		extension: ['ts']
	},
	{
		name: 'YAML',
		value: 'yaml',
		extension: ['yaml', 'yml']
	}
];

export { default as hljs } from 'highlight.js/lib/core';
