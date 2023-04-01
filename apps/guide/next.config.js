// import { fileURLToPath } from 'node:url';
// import bundleAnalyzer from '@next/bundle-analyzer';
// import { withContentlayer } from 'next-contentlayer';
const { fileURLToPath } = require('node:url');
const bundleAnalyzer = require('@next/bundle-analyzer');
const { withContentlayer } = require('next-contentlayer');

const withBundleAnalyzer = bundleAnalyzer({
	enabled: process.env.ANALYZE === 'true',
});

module.exports = withContentlayer(
	withBundleAnalyzer({
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
