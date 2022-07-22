// eslint-disable-next-line @typescript-eslint/no-require-imports, @typescript-eslint/no-var-requires
const UnoCSS = require('@unocss/webpack').default;

/**
 * @type {import('next').NextConfig}
 */
module.exports = {
	reactStrictMode: true,
	swcMinify: true,
	eslint: {
		ignoreDuringBuilds: true,
	},
	cleanDistDir: true,
	experimental: {
		images: {
			allowFutureImage: true,
		},
	},
	images: {
		dangerouslyAllowSVG: true,
		contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
	},
	webpack(config, context) {
		// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
		config.plugins.push(UnoCSS());

		if (context.buildId !== 'development') {
			// * disable filesystem cache for build
			// * https://github.com/unocss/unocss/issues/419
			// * https://webpack.js.org/configuration/cache/
			// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
			config.cache = false;
		}

		// eslint-disable-next-line @typescript-eslint/no-unsafe-return
		return config;
	},
};
