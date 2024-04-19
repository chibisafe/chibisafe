import fs from 'node:fs';
import path from 'node:path';

type Metadata = {
	image?: string;
	summary: string;
	title: string;
};

function parseFrontmatter(fileContent: string) {
	// eslint-disable-next-line prefer-named-capture-group
	const frontmatterRegex = /---\s*([\S\s]*?)\s*---/;
	const match = frontmatterRegex.exec(fileContent);
	const frontMatterBlock = match![1];
	const content = fileContent.replace(frontmatterRegex, '').trim();
	const frontMatterLines = frontMatterBlock?.trim().split('\n');
	const metadata: Partial<Metadata> = {};

	if (!frontMatterLines) return { metadata: metadata as Metadata, content };

	for (const line of frontMatterLines) {
		const [key, ...valueArr] = line.split(': ');
		let value = valueArr.join(': ').trim();
		// eslint-disable-next-line prefer-named-capture-group
		value = value.replace(/^["'](.*)["']$/, '$1'); // Remove quotes
		metadata[key?.trim() as keyof Metadata] = value;
	}

	return { metadata: metadata as Metadata, content };
}

function getMDXFiles(dir: string) {
	// eslint-disable-next-line n/no-sync
	return fs.readdirSync(dir).filter(file => path.extname(file) === '.mdx');
}

function readMDXFile(filePath: string) {
	// eslint-disable-next-line n/no-sync
	const rawContent = fs.readFileSync(filePath, 'utf8');
	return parseFrontmatter(rawContent);
}

function getMDXData(dir: string) {
	const mdxFiles = getMDXFiles(dir);
	return mdxFiles.map(file => {
		const { metadata, content } = readMDXFile(path.join(dir, file));
		const slug = path.basename(file, path.extname(file));

		return {
			metadata,
			slug,
			content
		};
	});
}

export function getPosts() {
	return getMDXData(path.join(process.cwd(), 'src', 'content', 'guides'));
}

export function getFaq() {
	return getMDXData(path.join(process.cwd(), 'src', 'content', 'faq'));
}
