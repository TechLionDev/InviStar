import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
	images: {
		remotePatterns: [
			{
				protocol: 'https',
				hostname: '**'
			},
			{
				protocol: 'http',
				hostname: '**'
			}
		],
		dangerouslyAllowSVG: true,
		contentSecurityPolicy:
			"default-src 'self'; img-src *; media-src *; script-src 'none'; sandbox;"
	},
	poweredByHeader: false,
};

export default nextConfig;
