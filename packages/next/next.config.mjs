// const withMDX = require('@next/mdx')();
import createMDX from '@next/mdx';
import remarkGfm from 'remark-gfm';

const withMDX = createMDX({
	// Add markdown plugins here, as desired
	options: {
		remarkPlugins: [remarkGfm],
		rehypePlugins: []
	}
});

/** @type {import('next').NextConfig} */
const nextConfig = {
	reactStrictMode: true,
	pageExtensions: ['mdx', 'ts', 'tsx']
};

export default withMDX(nextConfig);
