export function shouldUseGlobalFetchAndWebSocket() {
	// Browser env and deno when ran directly
	if (typeof globalThis.process === 'undefined') {
		return 'fetch' in globalThis && 'WebSocket' in globalThis;
	}

	if ('versions' in globalThis.process) {
		return 'deno' in globalThis.process.versions || 'bun' in globalThis.process.versions;
	}

	return false;
}
