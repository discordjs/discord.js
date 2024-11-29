/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable @typescript-eslint/no-require-imports */
// import { withContentlayer } from 'next-contentlayer';
const { withContentlayer } = require('next-contentlayer');

module.exports = withContentlayer({
	reactStrictMode: true,
	experimental: {
		typedRoutes: true,
	},
	images: {
		dangerouslyAllowSVG: true,
		contentDispositionType: 'attachment',
		contentSecurityPolicy: "default-src 'self'; frame-src 'none'; sandbox;",
	},
	poweredByHeader: false,
});
