/* eslint-disable n/prefer-global/process */

export function shouldUseGlobalFetchAndWebSocket() {
	// Browser env and deno when ran directly
	if (typeof globalThis.process === 'undefined') {
		return 'fetch' in globalThis && 'WebSocket' in globalThis;
	}

	// Cloudflare Workers with nodejs_compat polyfills process (including
	// process.versions.node), but natively supports the Web WebSocket API.
	// WebSocketPair is a Workers-only global; no other runtime exposes it.
	// @ts-expect-error WebSocketPair is not in the globalThis type
	if (typeof globalThis.WebSocketPair !== 'undefined') {
		return true;
	}

	if ('versions' in globalThis.process) {
		return 'deno' in globalThis.process.versions || 'bun' in globalThis.process.versions;
	}

	return false;
}
