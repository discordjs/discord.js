/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable @typescript-eslint/no-require-imports */
// import bundleAnalyzer from '@next/bundle-analyzer';
// import { withContentlayer } from 'next-contentlayer';
const bundleAnalyzer = require('@next/bundle-analyzer');
const { withContentlayer } = require('next-contentlayer');

const withBundleAnalyzer = bundleAnalyzer({
	enabled: process.env.ANALYZE === 'true',
});

module.exports = withBundleAnalyzer(
	withContentlayer({
		reactStrictMode: true,
		eslint: {
			ignoreDuringBuilds: true,
		},
		// Until Next.js fixes their type issues
		typescript: {
			ignoreBuildErrors: true,
		},
		experimental: {
			appDir: true,
			fallbackNodePolyfills: false,
		},
		images: {
			dangerouslyAllowSVG: true,
			contentDispositionType: 'attachment',
			contentSecurityPolicy: "default-src 'self'; frame-src 'none'; sandbox;",
		},
	}),
);
