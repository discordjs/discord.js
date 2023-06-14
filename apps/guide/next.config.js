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
		experimental: {
			appDir: true,
		},
		images: {
			dangerouslyAllowSVG: true,
			contentDispositionType: 'attachment',
			contentSecurityPolicy: "default-src 'self'; frame-src 'none'; sandbox;",
		},
	}),
);
