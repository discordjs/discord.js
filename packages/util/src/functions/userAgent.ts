/* eslint-disable n/prefer-global/process */
/* eslint-disable no-restricted-globals */

/**
 * Resolves the user agent string for the current environment.
 */
export function getUserAgent(): string | null {
	// Most (if not all) edge environments will have `process` defined. Withing a web browser we'll extract it using `navigator.userAgent`.
	return typeof globalThis.process === 'object'
		? globalThis.process.release?.name === 'node'
			? `Node.js/${globalThis.process.version}`
			: ''
		: // @ts-expect-error web env
		typeof globalThis.window === 'object'
		? // @ts-expect-error web env
		  globalThis.window.navigator.userAgent
		: null;
}
