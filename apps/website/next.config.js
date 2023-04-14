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
	outputFileTracing: true,
	experimental: {
		appDir: true,
		outputFileTracingRoot: fileURLToPath(new URL('../../', import.meta.url)),
		fallbackNodePolyfills: false,
		serverComponentsExternalPackages: ['@microsoft/api-extractor-model', 'jju'],
	},
	images: {
		dangerouslyAllowSVG: true,
		contentDispositionType: 'attachment',
		contentSecurityPolicy: "default-src 'self'; frame-src 'none'; sandbox;",
	},
	async redirects() {
		return [
			{
				source: '/static/logo.svg',
				destination: '/logo.svg',
				permanent: true,
			},
		];
	},
});
