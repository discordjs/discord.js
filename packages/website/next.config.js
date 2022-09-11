/* eslint-disable tsdoc/syntax */
import { URL, fileURLToPath } from 'node:url';
import UnoCss from '@unocss/webpack';

/**
 * @type {import('next').NextConfig}
 */
export default {
	reactStrictMode: true,
	swcMinify: true,
	eslint: {
		ignoreDuringBuilds: true,
	},
	experimental: {
		outputFileTracingRoot: fileURLToPath(new URL('../../', import.meta.url)),
	},
	images: {
		dangerouslyAllowSVG: true,
		contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
	},
	webpack: (config) => {
		config.plugins.push(UnoCss());
		return config;
	},
};
