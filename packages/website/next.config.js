/* eslint-disable tsdoc/syntax */
import { URL, fileURLToPath } from 'node:url';

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
		swcMinify: true,
		images: {
			allowFutureImage: true,
		},
		outputFileTracingRoot: fileURLToPath(new URL('../../', import.meta.url)),
	},
	images: {
		dangerouslyAllowSVG: true,
		contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
	},
};
