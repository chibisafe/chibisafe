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

const baseApiUrl = 'http://localhost:8000/api/';

/** @type {import('next').NextConfig} */
const nextConfig = {
	reactStrictMode: true,
	pageExtensions: ['mdx', 'ts', 'tsx'],
	env: {
		NEXT_PUBLIC_BASEAPIURL: baseApiUrl
	},
	logging: {
		fetches: {
			fullUrl: true
		}
	},
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
