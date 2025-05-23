import { createMDX } from 'fumadocs-mdx/next';
import type { NextConfig } from 'next';

const withMDX = createMDX();

export default withMDX({
	reactStrictMode: true,
	serverExternalPackages: ['typescript', 'twoslash'],
	images: {
		dangerouslyAllowSVG: true,
		contentDispositionType: 'attachment',
		contentSecurityPolicy: "default-src 'self'; frame-src 'none'; sandbox;",
		remotePatterns: [
			{
				protocol: 'http',
				hostname: 'localhost',
			},
		],
	},
	poweredByHeader: false,
	logging: {
		fetches: {
			fullUrl: true,
		},
	},
	experimental: {
		ppr: true,
		reactCompiler: true,
		useCache: true,
		dynamicOnHover: true,
	},
	eslint: {
		ignoreDuringBuilds: true,
	},
	typescript: {
		ignoreBuildErrors: true,
	},
} satisfies NextConfig);
