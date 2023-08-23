/* eslint-disable n/prefer-global/process */

/**
 * Resolves the user agent appendix string for the current environment.
 */
export function getUserAgentAppendix(): string {
	// https://vercel.com/docs/concepts/functions/edge-functions/edge-runtime#check-if-you're-running-on-the-edge-runtime
	// @ts-expect-error Vercel Edge functions
	if (typeof globalThis.EdgeRuntime !== 'undefined') {
		return 'Vercel-Edge-Functions';
	}

	// @ts-expect-error Cloudflare Workers
	if (typeof globalThis.R2 !== 'undefined' && typeof globalThis.WebSocketPair !== 'undefined') {
		// https://developers.cloudflare.com/workers/runtime-apis/web-standards/#navigatoruseragent
		return 'Cloudflare-Workers';
	}

	// https://docs.netlify.com/edge-functions/api/#netlify-global-object
	// @ts-expect-error Netlify Edge functions
	if (typeof globalThis.Netlify !== 'undefined') {
		return 'Netlify-Edge-Functions';
	}

	// Most (if not all) edge environments will have `process` defined. Within a web browser we'll extract it using `navigator.userAgent`.
	if (typeof globalThis.process !== 'object') {
		// @ts-expect-error web env
		if (typeof globalThis.navigator === 'object') {
			// @ts-expect-error web env
			return globalThis.navigator.userAgent;
		}

		return 'UnknownEnvironment';
	}

	if ('versions' in globalThis.process) {
		if ('deno' in globalThis.process.versions) {
			return `Deno/${globalThis.process.versions.deno}`;
		}

		if ('bun' in globalThis.process.versions) {
			return `Bun/${globalThis.process.versions.bun}`;
		}

		if ('node' in globalThis.process.versions) {
			return `Node.js/${globalThis.process.versions.node}`;
		}
	}

	return 'UnknownEnvironment';
}
