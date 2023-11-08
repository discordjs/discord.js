import bundleAnalyzer from '@next/bundle-analyzer';

const withBundleAnalyzer = bundleAnalyzer({
	enabled: process.env.ANALYZE === 'true',
});

export default withBundleAnalyzer({
	reactStrictMode: true,
	experimental: {
		typedRoutes: true,
		serverComponentsExternalPackages: ['@rushstack/node-core-library', '@discordjs/api-extractor-model', 'jju'],
	},
	images: {
		dangerouslyAllowSVG: true,
		contentDispositionType: 'attachment',
		contentSecurityPolicy: "default-src 'self'; frame-src 'none'; sandbox;",
	},
	poweredByHeader: false,
	env: {
		MAX_FETCH_SIZE: '5',
	},
	async redirects() {
		return [
			{
				source: '/static/logo.svg',
				destination: '/logo.svg',
				permanent: true,
			},
			{
				source: '/guide/:path*',
				destination: 'https://next.discordjs.guide/guide/:path*',
				permanent: true,
			},
		];
	},
});
