import { fileURLToPath } from 'node:url';
import bundleAnalyzer from '@next/bundle-analyzer';

const withBundleAnalyzer = bundleAnalyzer({
	enabled: process.env.ANALYZE === 'true',
});

export default withBundleAnalyzer({
	reactStrictMode: true,
	eslint: {
		ignoreDuringBuilds: true,
	},
	// Until Next.js fixes their type issues
	typescript: {
		ignoreBuildErrors: true,
	},
	outputFileTracing: true,
	experimental: {
		appDir: true,
		outputFileTracingRoot: fileURLToPath(new URL('../../', import.meta.url)),
		fallbackNodePolyfills: false,
		serverComponentsExternalPackages: ['@microsoft/api-extractor-model', 'jju'],
	},
	images: {
		dangerouslyAllowSVG: true,
		contentSecurityPolicy: "default-src 'self'; script-src 'none'; frame-src 'none'; sandbox;",
	},
});
