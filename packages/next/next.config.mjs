import createMDX from '@next/mdx';
import remarkGfm from 'remark-gfm';
import { readFileSync } from 'node:fs';

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
	output: 'standalone',
	pageExtensions: ['mdx', 'ts', 'tsx'],
	env: {
		NEXT_PUBLIC_VERSION: JSON.parse(readFileSync(new URL('../../package.json', import.meta.url), 'utf8')).version
	},
	logging: {
		fetches: {
			fullUrl: true
		}
	},
	images: {
		// TODO: Enable from anywhere or find a better way to configure it
		// this is used to be able to use <Image> with external URLs
		remotePatterns: [
			{
				protocol: 'http',
				hostname: 'localhost'
			}
		]
	},
	eslint: {
		ignoreDuringBuilds: true
	},
	typescript: {
		ignoreBuildErrors: true
	}
};

export default withMDX(nextConfig);
