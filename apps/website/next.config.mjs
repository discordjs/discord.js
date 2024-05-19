/**
 * @type {import('next').NextConfig}
 */
export default {
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
		ppr: true,
		reactCompiler: true,
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
};
