/**
 * Polyfill for `Symbol.dispose` and `Symbol.asyncDispose` which is used as a part of
 * {@link https://github.com/tc39/proposal-explicit-resource-management}. Node versions below 18.x
 * don't have these symbols by default, so we need to polyfill them.
 */
export function polyfillDispose() {
	// Polyfill for `Symbol.dispose` and `Symbol.asyncDispose` if not available.
	// Taken from https://www.typescriptlang.org/docs/handbook/release-notes/typescript-5-2.html#using-declarations-and-explicit-resource-management

	// @ts-expect-error This is a polyfill, so it's fine to write
	Symbol.dispose ??= Symbol('Symbol.dispose');
	// @ts-expect-error Same as above
	Symbol.asyncDispose ??= Symbol('Symbol.asyncDispose');
}
