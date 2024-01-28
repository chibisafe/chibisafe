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

const baseApiUrl = 'http://127.0.0.1:8000/api/';
process.env.BASEAPIURL = baseApiUrl;

/** @type {import('next').NextConfig} */
const nextConfig = {
	reactStrictMode: true,
	pageExtensions: ['mdx', 'ts', 'tsx'],
	async rewrites() {
		return [
			{
				source: '/api/:path*',
				destination: `${baseApiUrl}:path*`
			}
		];
	}
};

export default withMDX(nextConfig);
