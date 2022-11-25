/* eslint-disable tsdoc/syntax */
import { fileURLToPath } from 'node:url';

/**
 * @type {import('next').NextConfig}
 */
export default {
	reactStrictMode: true,
	eslint: {
		ignoreDuringBuilds: true,
	},
	cleanDistDir: true,
	experimental: {
		outputFileTracingRoot: fileURLToPath(new URL('../../', import.meta.url)),
		fallbackNodePolyfills: false,
	},
	images: {
		dangerouslyAllowSVG: true,
		contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
	},
};
