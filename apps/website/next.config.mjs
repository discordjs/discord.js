import bundleAnalyzer from '@next/bundle-analyzer';
import localesPlugin from '@react-aria/optimize-locales-plugin';

const withBundleAnalyzer = bundleAnalyzer({
	enabled: process.env.ANALYZE === 'true',
});

export default withBundleAnalyzer({
	reactStrictMode: true,
	images: {
		dangerouslyAllowSVG: true,
		contentDispositionType: 'attachment',
		contentSecurityPolicy: "default-src 'self'; frame-src 'none'; sandbox;",
	},
	logging: {
		fetches: {
			fullUrl: true,
		},
	},
	experimental: {
		ppr: false,
	},
	webpack(config, { isServer }) {
		if (!isServer) {
			config.plugins.push(localesPlugin.webpack({ locales: ['en-US'] }));
		}

		return config;
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
