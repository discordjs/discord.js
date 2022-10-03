/**
 * Lazy is a wrapper around a value that is computed lazily. It is useful for
 * cases where the value is expensive to compute and the computation may not
 * be needed at all.
 *
 * @param cb - The callback to lazily evaluate
 * @typeParam T - The type of the value
 * @example
 * ```ts
 * const value = lazy(() => computeExpensiveValue());
 * ```
 */
// eslint-disable-next-line promise/prefer-await-to-callbacks
export function lazy<T>(cb: () => T): () => T {
	let defaultValue: T;
	// eslint-disable-next-line promise/prefer-await-to-callbacks
	return () => (defaultValue ??= cb());
}
